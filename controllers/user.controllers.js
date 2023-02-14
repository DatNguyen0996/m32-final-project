const { sendResponse, AppError } = require("../helpers/utils.js");

const User = require("../models/User");
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

    const getData = await User.find(filter);
    let filterUser;

    name
      ? (filterUser = getData.filter((user) =>
          user.name.includes(name.toLowerCase())
        ))
      : (filterUser = getData);

    sendResponse(res, 200, true, { filterUser }, null, "Get User Success");
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
    sendResponse(res, 200, true, { updated }, null, "Update User Success");
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

    const updated = await User.findByIdAndUpdate(
      targetId,
      updateInfoDelete,
      options
    );
    sendResponse(res, 200, true, { updated }, null, "Update User Success");
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
