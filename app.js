var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var json = require('./getJson');


var index = require('./routes/index');
var multumesc = require('./routes/multumesc');
var register = require('./routes/register');

var app = express();

//mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(json.mongo.server + ':' + json.mongo.port + '/' + json.mongo.dbName);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '34SDgsdgspxxxxxxxdfsG',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/stylesheets', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/javascripts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/javascripts', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/javascripts', express.static(path.join(__dirname, '/node_modules/jquery-validation/dist')));
app.use(function(req, res, next) {
  req.db = db;
  next();
});


app.use('/', index);
app.use('/multumesc', multumesc);
app.use('/register', register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(req.originalUrl.includes('id')) req.session.url = req.url;
  res.redirect('/');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
