const express = require("express");
const {
  getAllTodos,
  getSingleTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  updateCompleted,
} = require("../controllers/todoController");
const authorization = require("../Middlewares/authorization");
const authorizeBy = require("../Middlewares/authorizeby");
const Route = express.Router();

Route.get("/", getAllTodos);
Route.post("/", authorization, createTodo);
Route.get("/:id", getSingleTodo); //Get Single Todo
Route.put("/:id", authorization, authorizeBy("user", "admin"), updateTodo); //Update Single Todo
Route.delete("/:id", [authorization, authorizeBy], deleteTodo); //Update Single Todo
Route.put("/:id/completed", updateCompleted); //Update compleate work Todo

module.exports = Route;
