const express = require("express");
const router = express.Router();
const { validate } = require("../validator/validator.js");

const {
  getAllTask,
  getTaskById,
  createTask,
  updateTaskStatus,
  assignTask,
  getAllTask1User,
  deleteTaskById,
} = require("../controllers/task.controllers");

//Read
/**
 * @route GET api/task?status=<status>
 * @description get all tasks
 * @access public
 */
router.get("/", validate.validateTaskStatus(), getAllTask);

//Read
/**
 * @route GET api/task/user/userId
 * @description get all tasks of 1 user
 * @access public
 */
router.get("/user/:userId", validate.validateUserId(), getAllTask1User);

//Read
/**
 * @route GET api/task/taskId
 * @description get a single task by id
 * @access public
 */
router.get("/:taskId", validate.validateTaskId(), getTaskById);

//Create
/**
 * @route POST api/task --- body request: name, description, status
 * @description create a task
 * @access public
 */
router.post("/", validate.validateTask(), createTask);

//Update
/**
 * @route PUT api/task/status/<taskId> ---body request: status
 * @description update a task status
 * @access public
 */
router.put("/status/:taskId", validate.validateTaskStatus(), updateTaskStatus);

//Update
/**
 * @route PUT api/task/assign/:taskId ---body request: userId
 * @description assign Task to user
 * @access public
 */
router.put(
  "/assign/:taskId",
  validate.validateTaskId(),
  validate.validateUserId(),
  assignTask
);

//Delete
/**
 * @route DELETE api/task/taskId
 * @description delete a task
 * @access public
 */
router.delete("/:taskId", validate.validateTaskId(), deleteTaskById);

//export

module.exports = router;
