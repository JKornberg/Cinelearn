/* eslint-disable no-self-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var express = require("express");
var mysql = require("mysql");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const fs = require('fs');
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('ececd3d662d1259408c9b162565367ef');

// var privateKey = fs.readFileSync('./private-key.pem', 'utf8');
/* GET home page. */ 
const connection = mysql.createConnection({
  host: 'database-1.cvifg4azbmac.us-east-2.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  password: 'Cinelearn!',
  database: 'cinelearn',
  multipleStatements: true
});

connection.connect()

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/hello", function (req, res, next) {
  res.send("Hello World");
});

router.get('/getSpanishSubs', (req, res) => {
  episode_num = req.query.episode_num
  connection.query(`SELECT * FROM subtitle WHERE episode_id=${episode_num} AND english_subtitle=\'\' ORDER BY start_time DESC`, (err, rows, fields) => 
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
  connection.query(`SELECT * FROM subtitle WHERE episode_id=${episode_num} AND spanish_subtitle=\'\' ORDER BY start_time DESC`, (err, rows, fields) => 
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
        question_dict.question_id = rows[i].question_id
        answer_info_list = english_answer_list.map((e,i) => {return [e,spanish_answer_list[i], is_correct_list[i]]})
        question_dict.answer_list = answer_info_list
        question_list.push(question_dict)
      }
      if(err) throw err
      res.status(200).json({
        status: "success",
        data: question_list,
      });
    })
})

router.get('/getVocabQuestions', (req, res) => {
  episode_num = req.query.episode_num
  connection.query(`SELECT * FROM vocab WHERE episode_id=${episode_num}`, (err, rows, fields) => 
    {
      if(err) throw err
      res.status(200).json({
        status: "success",
        data: rows,
      });
    })
})

router.get('/getUserContextProgress', (req, res) => {
  episode_num = req.query.episode_num
  user_id = req.query.user_id
  connection.query(`SELECT user_id,SUM(correct),episode_id 
  FROM progress JOIN question_progress ON progress.question_progress_id=question_progress.progress_id 
  JOIN question on question.question_id=question_progress.question_id GROUP BY user_id HAVING user_id=${user_id} AND episode_id=${episode_num}`, 
  (err, rows, fields) => 
    {
      if(rows.length > 0) {
        user_correct_num = rows[0]['SUM(correct)']
        episode_id = rows[0]['episode_id']
        user_id = rows[0]['user_id']
      }
      else {
        user_correct_num = 0
        episode_id = episode_num
        user_id = user_id
      }
      if(err) throw err

      mixpanel.track('User Context Progress', {
        'distinct_id': user_id,
        'episode_id': episode_num,
        'correct': user_correct_num
      });

      res.status(200).json({
        status: "success",
        user_correct: user_correct_num,
        episode_id: episode_id,
        user_id: user_id
      });
    })
})

router.get('/getUserVocabProgress', (req, res) => {
  episode_num = req.query.episode_num
  user_id = req.query.user_id
  connection.query(`SELECT user_id,SUM(correct),episode_id 
  FROM progress JOIN vocab_progress ON progress.vocab_progress_id=vocab_progress.progress_id 
  JOIN vocab on vocab.vocab_id=vocab_progress.vocab_id GROUP BY user_id HAVING user_id=${user_id} AND episode_id=${episode_num}`, 
  (err, rows, fields) => 
    {
      if(rows.length > 0) {
        user_correct_num = rows[0]['SUM(correct)']
        episode_id = rows[0]['episode_id']
        user_id = rows[0]['user_id']
      }
      else {
        user_correct_num = 0
        episode_id = episode_num
        user_id = user_id
      }
      if(err) throw err

      mixpanel.track('User Vocab Progress', {
        'distinct_id': user_id,
        'episode_id': episode_num,
        'correct': user_correct_num
      });

      res.status(200).json({
        status: "success",
        user_correct: user_correct_num,
        episode_id: episode_id,
        user_id: user_id
      });
    })
})


router.get('/getUserTotalProgress', (req, res) => {
  episode_num = req.query.episode_num
  user_id = req.query.user_id
  connection.query(`SELECT user_id,SUM(question_progress.correct),SUM(vocab_progress.correct) FROM progress 
  LEFT JOIN vocab_progress ON vocab_progress.progress_id=vocab_progress_id LEFT JOIN question_progress ON 
  question_progress.progress_id=question_progress_id GROUP BY user_id HAVING user_id=${user_id};`, 
  (err, rows, fields) => 
    {
      if(rows.length > 0) {
        user_correct_num = rows[0]['SUM(question_progress.correct)']+rows[0]['SUM(vocab_progress.correct)']
        episode_id = 0
        user_id = rows[0]['user_id']
      }
      else {
        user_correct_num = 0
        episode_id = episode_num
        user_id = user_id
      }
      if(err) throw err

      mixpanel.track('User Vocab Progress', {
        'distinct_id': user_id,
        'episode_id': episode_num,
        'correct': user_correct_num
      });

      res.status(200).json({
        status: "success",
        user_correct: user_correct_num,
        episode_id: episode_id,
        user_id: user_id
      });
    })
})

router.get('/getEpisodeContextInfo', (req, res) => {
  episode_num = req.query.episode_num
  user_id = req.query.user_id
  connection.query(`SELECT question.question_id,user_id,language,english_question,spanish_question,difficulty,correct,episode_id FROM question_progress 
  JOIN progress ON progress.question_progress_id=question_progress.progress_id JOIN question 
  ON question.question_id=question_progress.question_id WHERE user_id=${user_id} AND episode_id=${episode_num}`, 
  (err, rows, fields) => 
    {
      context_question_list = []
      for(var i = 0; i < rows.length; i++) {
        context_question_dict = {}
        context_question_dict.language = rows[i]['language']
        context_question_dict.english_question = rows[i]['english_question']
        context_question_dict.spanish_question = rows[i]['spanish_question']
        context_question_dict.difficulty = rows[i]['difficulty']
        context_question_dict.correct = rows[i]['correct']
        context_question_dict.episode_id = rows[i]['episode_id']
        context_question_dict.user_id = rows[i]['user_id']
        context_question_dict.question_id = rows[i]['question_id']
        context_question_list.push(context_question_dict)
      }
      if(err) throw err
      
      mixpanel.track('Episode Context Info', {
        'distinct_id': user_id,
        'episode_id': episode_num,
        'context_question_list': context_question_list
      });

      res.status(200).json({
        status: "success",
        context_question_list: context_question_list
      });
    })
})

router.get('/getEpisodeVocabInfo', (req, res) => {
  episode_num = req.query.episode_num
  user_id = req.query.user_id
  connection.query(`SELECT vocab.vocab_id,user_id,language,english_vocab,spanish_vocab,difficulty,correct,episode_id,explanation FROM vocab_progress 
  JOIN progress ON progress.vocab_progress_id=vocab_progress.progress_id JOIN vocab 
  ON vocab.vocab_id=vocab_progress.vocab_id WHERE user_id=${user_id} AND episode_id=${episode_num}`, 
  (err, rows, fields) => 
    {
      if(err) throw err
      
      mixpanel.track('Episode Vocab Info', {
        'distinct_id': user_id,
        'episode_id': episode_num,
        'vocab_question_list': rows
      });
      
      res.status(200).json({
        status: "success",
        vocab_question_list: rows
      });
    })
})

router.get('/createContextAnswer', (req, res) => {
  question_id = req.query.question_id
  correct = req.query.correct
  time = req.query.time
  language = req.query.language
  user_id = req.query.user_id
  connection.query(`INSERT INTO question_progress (question_id, correct,time)
  VALUES (${question_id},${correct},'${time}'); SELECT progress_id FROM question_progress WHERE progress_id=LAST_INSERT_ID()`, 
  (err, rows, fields) => 
    {
      if(err) throw err
      else {
        progress_id = JSON.parse(JSON.stringify(rows[1]))[0].progress_id
        connection.query(`INSERT INTO progress (user_id, language,question_progress_id)
        VALUES (${user_id},${language},${progress_id})`), 
        (err, rows, fields) => 
          {
            if(err) throw err
          }  
          res.status(200).json({
            status: "success",
          });
        }
    })
})

router.get('/createVocabAnswer', (req, res) => {
  question_id = req.query.question_id
  correct = req.query.correct
  time = req.query.time
  language = req.query.language
  user_id = req.query.user_id
  connection.query(`INSERT INTO vocab_progress (vocab_id, correct,time)
  VALUES (${question_id},${correct},'${time}'); SELECT progress_id FROM vocab_progress WHERE progress_id=LAST_INSERT_ID()`, 
  (err, rows, fields) => 
    {
      if(err) throw err
      else {
        progress_id = JSON.parse(JSON.stringify(rows[1]))[0].progress_id
        connection.query(`INSERT INTO progress (user_id, language,vocab_progress_id)
        VALUES (${user_id},${language},${progress_id})`), 
        (err, rows, fields) => 
          {
            if(err) throw err
          }  
          res.status(200).json({
            status: "success",
          });
        }
    })
})

router.get('/authUser', (req, res) => {
  username = req.query.username
  password = req.query.hashed_password
  connection.query(`SELECT user_id,password FROM user where user_name='${username}'`, 
  (err, rows, fields) => 
    {
      if(err) throw err
      if(rows.length > 0 && password == rows[0].password) {
        res.status(200).json({
          status: "success",
          user_id: rows[0].user_id
        });
      }
      else {
        res.status(200).json({
          status: "failed",
        });
      }
    })
})

router.get('/createUser', (req, res) => {
  username = req.query.username
  password = req.query.hashed_password
  connection.query(`INSERT INTO user (user_name, password) VALUES ('${username}', '${password}');`, 
  (err, rows, fields) => 
    {
      if(err) throw err
      else {
        res.status(200).json({
          status: "success",
        });
      }
    })
})



const LocalStrategy = require('passport-local').Strategy;





module.exports = router;