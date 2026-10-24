
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
const db = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Home route
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks", "/docs"],
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET: Get all tasks
app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();

  res.json(
    tasks.map((task) => ({
      ...task,
      done: Boolean(task.done),
    }))
  );
});

// GET: Get a single task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({
    ...task,
    done: Boolean(task.done),
  });
});

// POST: Create a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const result = db
    .prepare("INSERT INTO tasks (title, done) VALUES (?, ?)")
    .run(title.trim(), 0);

  const newTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json({
    ...newTask,
    done: Boolean(newTask.done),
  });
});

// PUT: Update an existing task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (
    (title !== undefined &&
      (typeof title !== "string" || title.trim() === "")) ||
    (done !== undefined && typeof done !== "boolean")
  ) {
    return res.status(400).json({
      error: "Title must be a non-empty string and done must be a boolean",
    });
  }

  const existingTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!existingTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updatedTitle =
    title !== undefined ? title.trim() : existingTask.title;

  const updatedDone =
    done !== undefined ? Number(done) : existingTask.done;

  db.prepare(
    "UPDATE tasks SET title = ?, done = ? WHERE id = ?"
  ).run(updatedTitle, updatedDone, id);

  const updatedTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  res.json({
    ...updatedTask,
    done: Boolean(updatedTask.done),
  });
});

// DELETE: Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/docs`);
});
