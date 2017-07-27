var express = require('express');
var router = express.Router();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/* GET home page. */

 router.get('/', function(req, res, next) {
   res.render('register', { title: 'Inregistrare', telefon: req.session.telefon });
   req.session.telefon = null;
 });

router.post('/submit', function (req, res, next) {
  var adresaIpLocala = req.connection.remoteAddress.split(':')[3];
  var db = req.db;
  var newCol = db.get('new-users');
  var user = {
    "nume": req.body.nume,
    "prenume": req.body.prenume,
    "telefon": req.body.telefon,
    "companie": req.body.companie,
    "email": req.body.email
  };

  newCol.insert(user);
  res.redirect('../multumesc/');



});
module.exports = router;
