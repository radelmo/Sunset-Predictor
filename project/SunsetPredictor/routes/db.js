// database logic goes here
// const Product = require('../models/movie');
const mongoose = require('mongoose');
const userModel = require('../models/user-model.js');
const postModel = require('../models/post-model.js');
const config = require("./config");

mongoose.connect(config.mongodb.dbURI, {useNewUrlParser: true }, () => {
  console.log('connected to mongodb');
});

function addUser(userObj) {
  console.log("Calling findOne");
  userModel.findOne({"googleId": userObj.id}, (err, usr) => {
    if (usr) {
      console.log("User " + usr + " has returned.")
    }
    else {
      console.log("Adding user " + userObj + " to database.")
      let thisUser = new userModel({
        userName: userObj.name,
        googleId: userObj.id,
      })
      thisUser.save((err) => {
        if (err) throw err
      })
    }
  })
  console.log("found one");
}

function getUser(usrId, done) {
  userModel.findOne({"_id": usrId}, (err, usr) => done(err, usr))
}


// call this to cache search results
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

