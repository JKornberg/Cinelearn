var express = require("express");
var mysql = require("mysql");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const fs = require('fs');
var privateKey = fs.readFileSync('./private-key.pem', 'utf8');
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/hello", function (req, res, next) {
  res.send("Hello World");
});

const LocalStrategy = require('passport-local').Strategy;








module.exports = router;

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'me',
//   password : 'secret',
//   database : 'my_db'
// });

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// connection.end();
