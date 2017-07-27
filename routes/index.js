var express = require('express');
var router = express.Router();
var https = require('https');
var zlib = require('zlib');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Guest portal' });
});


router.post('/login', function(req, res, next) {
  var adresaIpLocala = req.connection.remoteAddress.split(':')[3];
  var db = req.db;
  var userCol = db.get('users');
  var newCol = db.get('new-users');
  userCol.findOne({"telefon": req.body.telefon}, function(err, result) {
    if(result == null) {
      newCol.findOne({"telefon": req.body.telefon}, function(err, result2) {
        if(result2 == null) {
          req.session.telefon = req.body.telefon;
          res.redirect('/register');
        }
        else {
          userCol.update({telefon: req.body.telefon}, {$set: {attending: true}});
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
