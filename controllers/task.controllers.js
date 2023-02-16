const { sendResponse, AppError } = require("../helpers/utils.js");

const Task = require("../models/Task");
const { validationResult } = require("express-validator");

const toLowerCaseValue = (object) => {
  object.name = object.name.toLowerCase();
  object.description = object.description.toLowerCase();
  if (object.status) {
    object.status = object.status.toLowerCase();
  }

  return object;
};

const taskController = {};
//Create a task
taskController.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newTask = toLowerCaseValue(req.body);

    const created = await Task.create(newTask);
    sendResponse(res, 200, true, { created }, null, "Create Task Success");
  } catch (err) {
    next(err);
  }
};
//Get all task
taskController.getAllTask = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = { isDeleted: false };

    if (status) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      filter.status = status;
    } else {
      filter = { isDeleted: false };
    }

    const listOfTask = await Task.find(filter)
      .populate("assignTaskTo")
      .sort({ createdAt: 1, updatedAt: 1 });
    if (listOfTask.length === 0) {
      sendResponse(
        res,
        200,
        true,
        { listOfTask },
        null,
        "Does not have any task"
      );
    } else {
      sendResponse(
        res,
        200,
        true,
        { listOfTask },
        null,
        "Get all tasks Success"
      );
    }
  } catch (err) {
    next(err);
  }
};

//Get single task by id
taskController.getTaskById = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId } = req.params;
    let filter = { isDeleted: false, _id: `${taskId}` };

    const listOfTask = await Task.find(filter).populate("assignTaskTo");

    if (listOfTask.length === 0) {
      throw new AppError(402, "Bad Request", "Task is not found");
    } else {
      sendResponse(
        res,
        200,
        true,
        { listOfTask },
        null,
        "Get task by id Success"
      );
    }
  } catch (err) {
    next(err);
  }
};

//Update task status
taskController.updateTaskStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateStatus = req.body;
    const options = { new: true };
    const { taskId } = req.params;
    const targetId = taskId;

    const getTask = await Task.find({ isDeleted: false, _id: `${taskId}` });

    if (getTask.length === 0) {
      throw new AppError(402, "Bad Request", "Task is not found");
    } else if (getTask.status === "archive") {
      throw new AppError(402, "Bad Request", "status not allow to change");
    } else if (getTask.status === "done" && updateStatus.status !== "archive") {
      throw new AppError(402, "Bad Request", "status not allow to change");
    } else {
      const updateTask = await Task.findByIdAndUpdate(
        targetId,
        updateStatus,
        options
      );
      sendResponse(
        res,
        200,
        true,
        { updateTask },
        null,
        "Update Task Status Success"
      );
    }
  } catch (err) {
    next(err);
  }
};

//assign a task

taskController.assignTask = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const options = { new: true };
    const { taskId } = req.params;
    const targetId = taskId;
    console.log(userId);

    const assignTo = { assignTaskTo: userId };

    const errors = validationResult(req);
    if (!errors.isEmpty() && userId !== null) {
      return res.status(400).json({ errors: errors.array() });
    }

    const getTask = await Task.find({ isDeleted: false, _id: `${taskId}` });

    if (getTask.length === 0) {
      throw new AppError(402, "Bad Request", "Task is not found");
    } else {
      const assignTaskTo = await Task.findByIdAndUpdate(
        targetId,
        assignTo,
        options
      );
      sendResponse(
        res,
        200,
        true,
        { assignTaskTo },
        null,
        "Assign Task Success"
      );
    }
  } catch (err) {
    next(err);
  }
};

//Delete task

taskController.deleteTaskById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId } = req.params;
    const targetId = taskId;
    const updateInfoDelete = { isDeleted: true };
    const options = { new: true };

    let deleteTask = await Task.findByIdAndUpdate(
      targetId,
      updateInfoDelete,
      options
    );

    if (deleteTask !== null) {
      sendResponse(res, 200, true, { deleteTask }, null, "Delete Task Success");
    } else {
      throw new AppError(402, "Bad Request", "Task is not found");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = taskController;
