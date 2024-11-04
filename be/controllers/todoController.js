import { dateConstructor, formatDate } from "../helpers.js";
import { TodoModel } from "../models/todoModel.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description, status, loggedInUserId, loggedInUserEmail } =
      req.body;

      const timestamp = dateConstructor();
      const formattedDate = formatDate(timestamp);

    const todo = new TodoModel({
      title,
      description,
      status,
      userId: loggedInUserId,
      userEmail: loggedInUserEmail,
      is_deleted:false,
      new:false,
      created_at:formattedDate
    });
    await todo.save();
    return res.status(200).send({ msg: "Todo created successfully", todo });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const getTodo = async (req, res) => {
  try {
    const userId = req.body.loggedInUserId;
    

    // MongoDB aggregation pipeline
    const todos = await TodoModel.aggregate([
      {
        $match: { userId, is_deleted: false }, // Filter todos by userId and is_deleted flag
      },
      {
        $group: {
          // Group todos based on the status field
          _id: "$status",
          todos: { $push: "$$ROOT" }, // Collect todos for each status
        },
      },
      {
        $project: {
          // Restructure the output for each status type
          _id: 0,
          status: "$_id",
          todos: 1,
        },
      },
    ]);

    // Organize todos into todo, in_progress, and done categories
    const result = {
      todo: todos.find((group) => group.status === "todo")?.todos || [],
      in_progress: todos.find((group) => group.status === "in_progress")?.todos || [],
      done: todos.find((group) => group.status === "done")?.todos || [],
    };

    return res.status(200).send({ todos: result });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const getSingleTodo = async (req,res) => {
  try{
    const {id}=req.params
    if(!id){return res.status(404).send({message:"todo Id is required in query."})}
    const todo = await TodoModel.findById(id)
    if(!todo){return res.status(404).send({message:"todo with the given id is not present in the database."})}
    return res.status(200).send({todo})
  }catch(err){
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
}

export const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, description, status } = req.body;


    // Find the original todo by ID
    const originalTodo = await TodoModel.findById(todoId);
    if (!originalTodo) {
      return res.status(404).send({ message: "Todo not found" });
    }

    // Create a timestamp for the updated todo
    const timestamp = dateConstructor();
    const formattedDate = formatDate(timestamp);

    // Update fields
    const updatedTodo = {
      title: title || originalTodo.title,
      description: description || originalTodo.description,
      status: status || originalTodo.status,
      created_at: formattedDate,
      new: true,
      id_deleted:false
    };

    // Perform update
    const updatedTodoDbResponse = await TodoModel.findByIdAndUpdate(
      todoId,
      updatedTodo,
      { new: true }
    );

    return res.status(200).send({ message: "Todo updated successfully", updatedTodo: updatedTodoDbResponse });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;

    // Find the todo by ID
    let todo = await TodoModel.findById(todoId);
    if (!todo) {
      return res.status(404).send({ message: "Todo not found" });
    }

    // Update the is_deleted field to true
    todo.is_deleted = true;

    // Save the updated todo
    const updatedTodo = await todo.save();

    return res.status(200).send({
      message: "Todo marked as deleted successfully",
      updatedTodo
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const searchResult = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.body.loggedInUserId;

    if (!userId) return res.status(400).send({ message: "User ID is required." });
    if (!q) return res.status(400).send({ message: "Search query is required." });

    // Perform aggregation
    const results = await TodoModel.aggregate([
      { $match: { userId, is_deleted: false } }, // Filter todos by user ID and exclude deleted items
      { 
        $match: {
          $or: [
            { title: { $regex: q, $options: "i" } }, // Search by title (case-insensitive)
            { description: { $regex: q, $options: "i" } } // Search by description
          ]
        }
      }
    ]);

    // Categorize todos by status
    const todos = {
      todo: results.filter(item => item.status === 'todo'),
      in_progress: results.filter(item => item.status === 'in_progress'),
      done: results.filter(item => item.status === 'done')
    };

    res.status(200).send({ todos });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
};

export const sortedResult = async (req, res) => {
  try {
    const { sortBy } = req.query;
    const userId = req.body.loggedInUserId;

    if (!sortBy) return res.status(404).send({ message: "Sorting order is missing in req.query." });
    if (!userId) return res.status(404).send({ message: "UserId is required." });

    // Fetch and sort todos based on sortBy criteria
    const todos = await TodoModel.aggregate([
      {
        $match: { userId, is_deleted: false }, // Filter todos by userId and is_deleted flag
      },
      {
        $sort: { created_at: sortBy === "recent" ? 1 : -1 }, // Sort by created_at field (1 for ascending, -1 for descending)
      },
      {
        $group: {
          // Group todos based on the status field
          _id: "$status",
          todos: { $push: "$$ROOT" }, // Collect todos for each status
        },
      },
      {
        $project: {
          // Restructure the output for each status type
          _id: 0,
          status: "$_id",
          todos: 1,
        },
      },
    ]);

    // Organize todos into todo, in_progress, and done categories
    const result = {
      todo: todos.find((group) => group.status === "todo")?.todos || [],
      in_progress: todos.find((group) => group.status === "in_progress")?.todos || [],
      done: todos.find((group) => group.status === "done")?.todos || [],
    };

    // Send the response
    return res.send({ todos: result });
    
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
};

