const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require("express-validator");
const mongoose = require("mongoose");

const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');


require("./config/globalConstant");

// let options = {useNewUrlParser: true, useFindAndModify: false};
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose.mainConnection = mongoose.createConnection("mongodb://localhost/vendor", options);

//------------------------------------------- MAIN DB CONNECTION EVENTS-----------------------------------------------//
// When successfully connected
mongoose.mainConnection.on("connected", function () {
  console.log("Connected to main MongoDB ");
  mongoose.set("debug", true);
});

// If the connection throws an error
mongoose.mainConnection.on("error", function (err) {
  console.error("Mongoose main connection error: " + JSON.stringify(err));
});

// When the connection is disconnected
mongoose.mainConnection.on("disconnected", function () {
  console.log("Mongoose main connection disconnected");
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: false}));
//app.use(expressValidator());
app.use(cookieParser());

require("./routes")(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;console.log(err);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);console.log(err);
  res.send(err);
});

module.exports = app;
