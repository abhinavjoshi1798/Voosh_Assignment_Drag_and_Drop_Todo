import express from "express";
import { createTodo, getTodo, updateTodo, deleteTodo, getSingleTodo, searchResult, sortedResult } from "../controllers/todoController.js";

const todoRouter = express.Router();

todoRouter.post("/createtodo", createTodo);
todoRouter.get("/gettodo", getTodo);
todoRouter.get("/getsingletodo/:id", getSingleTodo);
todoRouter.put("/updatetodo/:todoId", updateTodo);
todoRouter.delete("/deletetodo/:todoId", deleteTodo);
todoRouter.get("/search",searchResult)
todoRouter.get("/sorteddata",sortedResult)


export { todoRouter };
