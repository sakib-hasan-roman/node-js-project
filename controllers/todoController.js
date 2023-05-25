const Todo = require("../models/Todo");
const User = require("../models/User");

const getAllTodos = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const totalCount = await Todo.countDocuments();
    const currentPage = pageNumber;
    const totalPage = Math.ceil(totalCount / limitNumber);
    const hasNextPage = totalCount > pageNumber + skip;
    const haspreviousPage = currentPage > 1;
    const nextPage = hasNextPage ? pageNumber + 1 : null;
    const previousPage = haspreviousPage ? pageNumber - 1 : null;
    // const todos = await Todo.find({}).populate("user");
    const todos = await Todo.find()
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });
    const data = {
      ...todos,
      totalCount,
      currentPage,
      totalPage,
      hasNextPage,
      haspreviousPage,
      nextPage,
      previousPage,
    };
    res.status(201).json({
      success: true,
      data: data,
    });
    // console.log(todos);
  } catch (error) {
    next(error);
    // console.log(error);
  }
};

const getSingleTodo = async (req, res, next) => {
  try {
    const singleTodo = await Todo.findById(req.params.id);
    console.log(singleTodo);
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const singleTodo = new Todo();
    singleTodo.title = req.body.title;
    singleTodo.description = req.body.description;
    singleTodo.user = req.user.userId;
    const saveTodo = await singleTodo.save();
    const user = await User.findById(req.user.userId);
    user.todos.push(saveTodo._id);
    await user.save();
    console.log(saveTodo);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status.json({
        success: false,
        data: "Data Not found for Update !",
      });
    }

    todo.title = req.body.title;
    todo.description = req.body.description;
    const updateTodo = await todo.save();
    return res.status.json({
      success: true,
      data: updateTodo,
    });
    console.log(updateTodo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(400).json({
        success: false,
        data: "Data Not found for Delete !",
      });
    }

    res.status(200).json({
      success: false,
      data: todo,
    });
    console.log(todo);
  } catch (error) {
    next(error);
  }
};

const updateCompleted = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        data: "ID not found or something went wrong !",
      });
    }
    const updateTodo = await todo.CompleteUpdatedTodo();
    console.log(updateTodo);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTodos,
  getSingleTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  updateCompleted,
};
