const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

router.post('/', function (req, res, next) {
    console.log("Request body: ", req.body)
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        console.log(err, user)
        return res.status(400).json({
          message: info.message || 'Something is not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        console.log("In login")
        console.log("user: ", user)
        if (err) {
          res.send(err);
        }
        // generate a signed JSON Web Token with the contents of the user object and return it in the response
        const token = jwt.sign(user, process.env.secret_key, { algorithm: 'HS256' });
        return res.json({ user, token });
      });
    })(req, res, next);
});
module.exports = router;
  