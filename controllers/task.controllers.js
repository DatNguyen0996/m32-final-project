const { sendResponse, AppError } = require("../helpers/utils.js");

const Task = require("../models/Task");
const { validationResult } = require("express-validator");

const toLowerCaseValue = (object) => {
  object.name = object.name.toLowerCase();
  object.description = object.description.toLowerCase();
  object.status = object.status.toLowerCase();
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

    const listOfFound = await Task.find(filter)
      .populate("asignTaskTo")
      .sort({ createdAt: 1, updatedAt: 1 });
    sendResponse(
      res,
      200,
      true,
      { listOfFound },
      null,
      "Get all tasks Success"
    );
  } catch (err) {
    next(err);
  }
};

//Get all task of 1 user
taskController.getAllTask1User = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    let filter = { isDeleted: false, asignTaskTo: `${userId}` };

    const listOfFound = await Task.find(filter).populate("asignTaskTo");
    sendResponse(
      res,
      200,
      true,
      { listOfFound },
      null,
      "Get all tasks of user Success"
    );
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

    const listOfFound = await Task.find(filter).populate("asignTaskTo");
    sendResponse(
      res,
      200,
      true,
      { listOfFound },
      null,
      "Get task by id Success"
    );
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
    const taskfound = await Task.findById(targetId);

    console.log(taskfound.status);

    if (taskfound.status === "archive") {
      throw new AppError(402, "Bad Request", "status not allow to change");
    } else if (
      taskfound.status === "done" &&
      updateStatus.status !== "archive"
    ) {
      throw new AppError(402, "Bad Request", "status not allow to change");
    } else {
      const updated = await Task.findByIdAndUpdate(
        targetId,
        updateStatus,
        options
      );
      sendResponse(res, 200, true, { updated }, null, "Update User Success");
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
    // if (userId === null) {
    //   console.log("true");
    // } else {
    //   console.log("false");
    // }
    const assignTo = { asignTaskTo: userId };

    const errors = validationResult(req);
    if (!errors.isEmpty() && userId !== null) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updated = await Task.findByIdAndUpdate(targetId, assignTo, options);
    sendResponse(res, 200, true, { updated }, null, "Update User Success");
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

    const updated = await Task.findByIdAndUpdate(
      targetId,
      updateInfoDelete,
      options
    );
    sendResponse(res, 200, true, { updated }, null, "Update User Success");
  } catch (err) {
    next(err);
  }
};

module.exports = taskController;
