/* eslint-disable no-self-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var express = require("express");
var mysql = require("mysql");
const router = express.Router();s
const jwt = require('jsonwebtoken');s
const passport = require('passport');
const fs = require('fs');s
// var privateKey = fs.readFileSync('./private-key.pem', 'utf8');
/* GET home page. */
const connection = mysql.createConnection({
  host: '***REMOVED***',
  port: 3306,
  user: 'admin',
  password: '***REMOVED***',
  database: 'cinelearn'
});

connection.connect()

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/hello", function (req, res, next) {
  res.send("Hello World");
});

router.get('/getEpisode', (req, res) => {
  episode_num = req.query.episode_num
  user_id = req.query.user_id
  spanish_subtitle_data = []
  english_subtitle_data = []
  connection.query(`SELECT * FROM subtitle WHERE episode_id=${episode_num} AND english_subtitle=\'\' ORDER BY start_time`, (err, rows, fields) => 
    {
      if(err) throw err
      spanish_subtitle_data = rows
      res.status(200).json({
        status: "success",
        spanish_subs: rows,
      });
    })
})

router.get('/getEnglishSubs', (req, res) => {
  episode_num = req.query.episode_num
  connection.query(`SELECT * FROM subtitle WHERE episode_id=${episode_num} AND spanish_subtitle=\'\' ORDER BY start_time`, (err, rows, fields) => 
    {
      if(err) throw err
      res.status(200).json({
        status: "success",
        english_subs: rows,
      });
    })
})

router.get('/getContextQuestions', (req, res) => {
  episode_num = req.query.episode_num
  connection.query(`SELECT question.question_id, question.english_question, question.spanish_question, question.start_time, question.difficulty, 
  GROUP_CONCAT(english_answer), GROUP_CONCAT(spanish_answer), GROUP_CONCAT(is_correct) FROM question INNER JOIN answer ON 
  question.question_id=answer.question_id WHERE question.episode_id=${episode_num} GROUP BY question.question_id`, (err, rows, fields) => 
    {
      question_list = []
      for(var i = 0; i < rows.length; i++) {
        question_dict = {}
        question_dict.english_question = rows[i].english_question
        question_dict.spanish_question = rows[i].spanish_question
        question_dict.start_time = rows[i].start_time
        question_dict.difficulty = rows[i].difficulty
        english_answer_list = rows[i]['GROUP_CONCAT(english_answer)'].split(",")
        spanish_answer_list = rows[i]['GROUP_CONCAT(spanish_answer)'].split(",")
        is_correct_list = rows[i]['GROUP_CONCAT(is_correct)'].split(",")
        console.log(typeof english_answer_list)
        answer_info_list = english_answer_list.map((e,i) => {return [e,spanish_answer_list[i], is_correct_list[i]]})
        question_dict.answer_list = answer_info_list
        question_list.push(question_dict)
      }
      rows = rows
      if(err) throw err
      res.status(200).json({
        status: "success",
        data: question_list,
      });
    })
})



const LocalStrategy = require('passport-local').Strategy;





module.exports = router;