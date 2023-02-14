const { sendResponse, AppError } = require("./helpers/utils.js");
require("dotenv").config();
const cors = require("cors");

var express = require("express"),
  expressValidator = require("express-validator");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();
// const validatorOption = {};
// app.use(expressValidator(validatorOption));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
/* DB connection*/
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to Database!"))
  .catch((err) => console.log(err));

app.use("/", indexRouter);

// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});
module.exports = app;
