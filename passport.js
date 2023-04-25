
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/* POST login. */
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    function (username, password, cb) {
        // Replace this with your own user authentication logic
        // For example, you can query your database to find the user with the given email and password
        const user = { username: username }; // This is a mock user object
        console.log("IN HERE")
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        return cb(null, user, {
            message: 'Logged In Successfully'
        });
    }));