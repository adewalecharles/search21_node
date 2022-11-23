require("dotenv").config();
const cors = require("cors");
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
require('./util/database');

const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");
/**
 * morgan logs every http request by default to the console .. you can set it to log to a file instead
 */
const logger = require("morgan");
/**
 * helmet is a middleware that adds and removes some headers for adding more security
 */
const helmet = require("helmet");
/**
 * const debug = require("debug")("app:log"); // You are free to name the debug namespace as you like
 * +0ms is time spent from the last debug message
 */
const debug = require("debug")("app:db");

const app = express();

var corsOptions = {
  origin: "http://localhost",
};

app.use(cors(corsOptions));

app.use(helmet());


if (process.env.NODE_ENV !== "production") app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', function(req, res, next)  {
  res.json({ status: true, message: "Welcome To ToDo API" });
});

app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send error response
  res.status(err.status || 500).json({status: false, message: err.message});
});

module.exports = app;
