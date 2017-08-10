var express = require('express');
var router = express.Router();
var https = require('https');
var json = require('../getJson');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

router.get('/', function (req, res, next) {
  res.render('index', { title: json.title, fields: json.fields, message: json.messages.login });
});


router.post('/login', function(req, res, next) {
  var queryObject = {};
  for(var key in json.fields) {
    if(json.fields[key].login === true) queryObject[key] = req.body[key];
  }
  
  var db = req.db;
  var userCol = db.get('users');
  var newCol = db.get('new-users');
  userCol.findOne(queryObject, function(existingUserError, existingUser) {
    if(existingUser == null) {
      newCol.findOne(queryObject, function(signedUpUserError, signedUpUser) {
        if(signedUpUser == null) {
          req.session.autocompleteFields = queryObject;
          res.redirect('/register');
        }
        else {
          newCol.update(queryObject, {$set: {attending: true}});
          res.redirect('/multumesc');
        }
      });
      
    }    
    else {
      userCol.update(queryObject, {$set: {attending: true}});
      res.redirect('/multumesc');
    }
  });
});

module.exports = router;
