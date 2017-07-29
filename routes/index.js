var express = require('express');
var router = express.Router();
var https = require('https');
var zlib = require('zlib');
var json = require('../getJson');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Guest portal', fields: json.fields, message: json.messages.login });
});


router.post('/login', function(req, res, next) {
  var queryObject = {};
  for(var key in json.fields) {
    if(json.fields[key].login === true) queryObject[key] = req.body[key];
  }
  
  var db = req.db;
  var userCol = db.get('users');
  var newCol = db.get('new-users');
  userCol.findOne(queryObject, function(err, result) {
    if(result == null) {
      newCol.findOne(queryObject, function(err, result2) {
        if(result2 == null) {
          req.session.autocompleteFields = queryObject;
          res.redirect('/register');
        }
        else {
          userCol.update(queryObject, {$set: {attending: true}});
          res.redirect('/multumesc');
        }
      });
      
    }    
    else {
      userCol.update({telefon: req.body.telefon}, {$set: {attending: true}});
      res.redirect('/multumesc');
    }
  });
});

module.exports = router;
