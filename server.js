
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// Health endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Stage 1: Get all tasks from SQLite
app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();

  res.json(
    tasks.map((task) => ({
      ...task,
      done: Boolean(task.done)
    }))
  );
});

// Stage 1: Get one task from SQLite
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  const task = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
  ).get(id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.json({
    ...task,
    done: Boolean(task.done)
  });
});

 // Stage 2: Create a new task in SQLite
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (
    !title ||
    typeof title !== "string" ||
    title.trim() === ""
  ) {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const result = db.prepare(
    "INSERT INTO tasks (title, done) VALUES (?, ?)"
  ).run(title.trim(), 0);

  const newTask = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
  ).get(result.lastInsertRowid);

  res.status(201).json({
    ...newTask,
    done: Boolean(newTask.done)
  });
});


// Temporary note:
// POST, PUT and DELETE will be connected to SQLite in Stages 2 and 3.

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
