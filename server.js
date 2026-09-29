const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Learn JavaScript",
    done: false
  },
  {
    id: 2,
    title: "Build an API",
    done: false
  },
  {
    id: 3,
    title: "Test the API",
    done: true
  }
];

// Stage 1: Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// Stage 1: Health endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Stage 2: Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Stage 2: Get one task
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  res.json(task);
});

// Stage 3: Create a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});