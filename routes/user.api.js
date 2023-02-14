const express = require("express");
const router = express.Router();

const { validate } = require("../validator/validator.js");
const {
  createUser,
  getAllUser,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controllers");

//Read
/**
 * @route GET api/user?name=<name>
 * @description get list of
 * @access public
 */
router.get("/", getAllUser);

//Create
/**
 * @route POST api/user --- body request: name, role
 * @description create a user
 * @access public
 */
router.post("/", validate.validateUser(), createUser);

//Update
/**
 * @route PUT api/user/<userId> --- body request: name, role
 * @description update a
 * @access public
 */
router.put(
  "/:userId",
  validate.validateUserId(),
  validate.validateUser(),
  updateUserById
);

//Delete
/**
 * @route DELETE api/
 * @description delet a
 * @access public
 */
router.delete("/:userId", validate.validateUserId(), deleteUserById);

//export

module.exports = router;
