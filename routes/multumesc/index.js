var express = require('express');
var router = express.Router();
var https = require('https');
var zlib = require('zlib');
var json = require("../../getJson");


router.get('/', function(req, res, next) {
  res.render('multumesc', { message: json.messages.multumesc });
  var link = req.session.url;
  var addrMac = link.split('id=')[1].substring(0, 17);
  req.session.url = null;
  authorizeGuest(addrMac);
});

var login = JSON.stringify({
    username: json.controllerAuth.username,
    password: json.controllerAuth.password,
    remember: false,
    strict: true
  });


function authorizeGuest(mac) {
    var server = json.server;
    var cookie;
    var loginRequest = https.request({
        host: server,
        port: 8443,
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(login),
          'Accept': 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
        path: '/api/login'
      }, function (response) {
  
        cookie = response.headers["set-cookie"][0].split(' ')[0];
        var token = response.headers["set-cookie"][1].split(' ')[0].split(';')[0];
        var finalCookie = cookie + " " + token;


        var data = JSON.stringify({
          "mac": mac,
          "cmd": "authorize-guest"
        });
        var authDeviceRequest = https.request({
          host: server,
          rejectUnauthorized: false,
          method: 'POST',
          port: 8443,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': finalCookie,
            'X-Csrf-Token': token.split('=')[1],
            'Connection': 'keep-alive',
            'Content-Length': Buffer.byteLength(data)
          },
          path: '/api/s/' + json.site + '/cmd/stamgr'
        }, function (secondResponse) {
          logoutFromController(server);
        });
        authDeviceRequest.write(data);
        authDeviceRequest.end();

  
      });
      loginRequest.write(login);
      loginRequest.end();
  }

  function logoutFromController(server) {
    var logoutRequest = https.request({
      host: server,
      port: 8443,
      rejectUnauthorized: false,
      path: '/logout',
      method: 'GET'
    }, function (finalResponse) {

    });
    logoutRequest.end();
  }
module.exports = router;
