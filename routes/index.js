const express = require("express");
const router = express.Router();

let todos = [];

// Homepage - show tasks
router.get("/", (req, res) => {
  res.render("index", { title: "Smart To-Do List", todos });
});

// Add task
router.post("/add", (req, res) => {
  const task = req.body.task;
  if (task) {
    todos.push({ text: task, done: false });
  }
  res.redirect("/");
});

// Mark task as done
router.post("/done/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (todos[id]) {
    todos[id].done = !todos[id].done;
  }
  res.redirect("/");
});

// Delete task
router.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (todos[id]) {
    todos.splice(id, 1);
  }
  res.redirect("/");
});

module.exports = router;
