
const mongoose = require('mongoose');
const userModel = require('../models/user-model.js');
const postModel = require('../models/post-model.js');
const config = require("./config");

mongoose.connect(config.mongodb.dbURI, {useNewUrlParser: true }, () => {
  console.log('connected');
});

function addUser(userObj) {
  console.log("Calling findOne");
  userModel.findOne({"googleId": userObj.id}, (err, user) => {
    if (user) {
      console.log("User " + user );
    }
    else {
      console.log("Adding user " + userObj + " to database.")
      let curUser = new userModel({
        userName: userObj.name,
        googleId: userObj.id,
      })
      curUser.save((err) => {
        if (err) throw err
      })
    }
  })
  console.log("found one");
}

function getUser(userId, done) {
  userModel.findOne({"_id": userId}, (err, user) => done(err, user))
}


function addPost(postObj) {
  let post = new posthModel({
    content : postObj.results
  })
  search.save((err) => {
    if (err) throw err
  })
}

function getPost(postQuery, done) {
  postModel.findOne({"_id": postQuery}, (err, usr) => done(err, usr));
}

module.exports = {
  addUser,
  getUser,
  addPost,
  getPost
}

