const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String },
    role: {
      type: String,
      default: "employee",
      enum: ["manager", "employee"],
      require: true,
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

const User = mongoose.model("User", userSchema);
module.exports = User;
