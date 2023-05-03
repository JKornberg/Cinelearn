/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var createError = require("http-errors");
var express = require("express");
const mysql = require('mysql')
const cors = require('cors');
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('ececd3d662d1259408c9b162565367ef');

var app = express();
app.use(cors())

app.use(express.json());

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser"); // Add this line

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var auth = require('./routes/auth');
require('./passport');


app.use('/login', auth);

app.use('/auth', auth);


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
// app.use(bodyParser.json()); // Add this line
// app.use(bodyParser.urlencoded({ extended: true })); // Add this line
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
 

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(80, () => {
  console.log("SERVER RUNS PERFECTLY!");
});

module.exports = app;
