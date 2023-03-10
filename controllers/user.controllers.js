const { sendResponse, AppError } = require("../helpers/utils.js");

const User = require("../models/User");
const Task = require("../models/Task");
const { validationResult } = require("express-validator");

const userController = {};
const toLowerCaseValue = (object) => {
  object.name = object.name.toLowerCase();
  object.role = object.role.toLowerCase();
  return object;
};

//Create a user
userController.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser = toLowerCaseValue(req.body);
    const created = await User.create(newUser);
    sendResponse(res, 200, true, { created }, null, "Create User Success");
  } catch (err) {
    next(err);
  }
};

//Get all user

userController.getAllUser = async (req, res, next) => {
  const { name } = req.query;
  const filter = { isDeleted: false };

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const getUser = await User.find(filter);
    let listOfUser;

    name
      ? (listOfUser = getUser.filter((user) =>
          user.name.includes(name.toLowerCase())
        ))
      : (listOfUser = getUser);

    if (listOfUser.length === 0) {
      sendResponse(res, 200, true, { listOfUser }, null, "Users not found");
    }

    sendResponse(res, 200, true, { listOfUser }, null, "Get Users Success");
  } catch (err) {
    next(err);
  }
};

//Get user by id

userController.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  const filter = { isDeleted: false };

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    filter._id = userId;
    const getUser = await User.find(filter);
    // sendResponse(res, 200, true, { getUser }, null, "Get User Success");
    if (getUser.length !== 0) {
      sendResponse(res, 200, true, { getUser }, null, "Get User Success");
    } else {
      throw new AppError(402, "Bad Request", "User is not found");
    }
  } catch (err) {
    next(err);
  }
};

//Get all task of 1 user
userController.getAllTaskOfOneUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const checkUser = await User.find({ isDeleted: false, _id: `${userId}` });
    console.log(checkUser);

    if (checkUser.length === 0) {
      throw new AppError(402, "Bad Request", "User is not found");
    }

    const filter = { isDeleted: false, assignTaskTo: `${userId}` };

    const listOfFound = await Task.find(filter).populate("assignTaskTo");

    if (listOfFound.length === 0) {
      sendResponse(
        res,
        200,
        true,
        { listOfFound },
        null,
        "User have not any task"
      );
    } else {
      sendResponse(
        res,
        200,
        true,
        { listOfFound },
        null,
        "Get all tasks of user Success"
      );
    }
  } catch (err) {
    next(err);
  }
};

//Update a user
userController.updateUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const updateUser = req.body;
    const targetId = userId;
    const options = { new: true };

    const updated = await User.findByIdAndUpdate(targetId, updateUser, options);
    if (updated === null) {
      throw new AppError(402, "Bad Request", "User is not found");
    } else {
      sendResponse(res, 200, true, { updated }, null, "Update User Success");
    }
  } catch (err) {
    next(err);
  }
};
//Delete user

userController.deleteUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const targetId = userId;
    const updateInfoDelete = { isDeleted: true };
    const options = { new: true };

    const deleteUser = await User.findByIdAndUpdate(
      targetId,
      updateInfoDelete,
      options
    );
    if (deleteUser !== null) {
      sendResponse(res, 200, true, { deleteUser }, null, "Delete User Success");
    } else {
      throw new AppError(402, "Bad Request", "User is not found");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
