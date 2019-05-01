var express = require('express');
var router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const users = {};
const config = require("./config");
const app = express();
const User = require('../models/user-model');
const mongodb = require("./db");



passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user) => {
        done(null, user);
    });

});
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy({
            clientID: config.googleConfig.clientId,
            clientSecret: config.googleConfig.clientSecret,
            callbackURL: "/auth/google/callback",
            //passReqToCallback   : true
        },
        (accessToken, refreshToken, profile,  done)=>{
            //passport callback function
            //console.log(profile);
            console.log("adding user");
            mongodb.addUser(profile);
            console.log("user added");

            res.redirect("/");
        })
)


module.exports = {
    router,
    passport,
};

