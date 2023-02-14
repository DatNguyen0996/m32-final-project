const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "working", "review", "done", "archive"],
      require: true,
    },
    asignTaskTo: {
      // type: mongoose.SchemaTypes.ObjectId,
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "User",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//Create and export model

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
