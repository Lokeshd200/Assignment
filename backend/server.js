
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// Initialize SQLite database
const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Routes
// 1. Get all tasks
app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// 2. Get a single task by ID
app.get("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM tasks WHERE id = ${id}`, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.json(row);
    }
  });
});

// 3. Add a new task
app.post("/api/tasks", (req, res) => {
  const { title, description } = req.body;
  db.run(
    `INSERT INTO tasks (title, description) VALUES ('${title}','${description}')`,
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, title, description });
      }
    }
  );
});

// 4. Update a task
app.put("/api/tasks/:id", (req, res) => {
  const {id} = req.params;
  const { title, description } = req.body;
  console.log(id);
  console.log(title);
  db.run(
    `UPDATE tasks SET title = '${title}', description = '${description}' WHERE id = ${id};`,
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json({ message: "Task updated successfully" });
      }
    }
  );
});

// 5. Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params;
  db.run(`DELETE FROM tasks WHERE id = ${id};`, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.json({ message: "Task deleted successfully" });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
