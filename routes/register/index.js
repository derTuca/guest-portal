var express = require('express');
var router = express.Router();
var json = require('../../getJson');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


 router.get('/', function(req, res, next) {
   var autocompleteFields = req.session.autocompleteFields ? req.session.autocompleteFields : {};
   res.render('register', { title: 'Inregistrare', autocompleteFields: autocompleteFields, fields: json.fields, message: json.messages.register });
   if(req.session.autocompleteFields) req.session.autocompleteFields = null;
 });

router.post('/submit', function (req, res, next) {
  var user = {};
  for(var key in json.fields) {
    user[key] = req.body[key];
  }

  var db = req.db;
  var newCol = db.get('new-users');
  newCol.insert(user);
  res.redirect('../multumesc/');

});

module.exports = router;
