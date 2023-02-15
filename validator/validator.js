const { check } = require("express-validator");

let validateUser = () => {
  return [
    check("name", "name does not Empty").not().isEmpty(),
    check("role", "role does not Empty").not().isEmpty(),
    check("role", "role must be manager or employee").isIn([
      "manager",
      "employee",
    ]),
  ];
};

let validateTask = () => {
  return [
    check("name", "name does not Empty").not().isEmpty(),
    check("description", "description does not Empty").not().isEmpty(),
    // check("status", "status does not Empty").not().isEmpty(),
    // check(
    //   "status",
    //   "status must be pending or working or review or done or archive"
    // ).isIn(["pending", "working", "review", "done", "archive"]),
  ];
};

let validateTaskStatus = () => {
  return [
    check("status", "status does not Empty").not().isEmpty(),
    check(
      "status",
      "status must be pending or working or review or done or archive"
    ).isIn(["pending", "working", "review", "done", "archive"]),
  ];
};

let validateUserId = () => {
  return [
    // check("userId", "userId does not Empty").isIn([isMongoId, null]),
    check("userId", "userId must be a MongoDB ObjectId").isMongoId(),
  ];
};

let validateTaskId = () => {
  return [
    // check("taskId", "taskId does not Empty").not().isEmpty(),
    check("taskId", "taskId must be a MongoDB ObjectId").isMongoId(),
  ];
};

let validate = {
  validateUser: validateUser,
  validateTask: validateTask,
  validateUserId: validateUserId,
  validateTaskId: validateTaskId,
  validateTaskStatus: validateTaskStatus,
};

module.exports = { validate };
