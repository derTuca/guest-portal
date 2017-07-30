var express = require('express');
var router = express.Router();
var https = require('https');
var zlib = require('zlib');
var mcache = require('memory-cache');
var json = require("../../getJson");


router.get('/', function (req, res, next) {
  res.render('multumesc', { message: json.messages.multumesc });
  let link = req.session.url;
  let addrMac = link.split('id=')[1].substring(0, 17);
  req.session.url = null;
  beginAuthorizeProcess(addrMac);
});




function beginAuthorizeProcess(mac) {
  let server = json.server;

  let login = JSON.stringify({
    username: json.controllerAuth.username,
    password: json.controllerAuth.password,
    remember: false,
    strict: true
  });

  let loginRequest = https.request({
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
  }, function (loginResponse) {
    let cookie = loginResponse.headers["set-cookie"][0].split(' ')[0];
    let token = loginResponse.headers["set-cookie"][1].split(' ')[0].split(';')[0];
    let finalCookie = cookie + " " + token;
    if (json.site.id == null) {
      let cachedId = mcache.get('siteId');
      if (cachedId) authorizeDevice(cachedId, mac, token, finalCookie);
      else {
        https.request({
          host: server,
          port: 8443,
          method: 'GET',
          rejectUnauthorized: false,
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': finalCookie,
            'Connection': 'keep-alive'
          },
          path: '/api/stat/sites'
        }, function (sitesResponse) {
          var data = [];
          let gunzip = zlib.createGunzip();
          sitesResponse.pipe(gunzip);
          gunzip.on('data', function (chunk) {
            data.push(chunk);
          });
          gunzip.on('end', function () {
            let decompressedData = Buffer.concat(data);
            var id = "";
            decompressedData.data.forEach(function (element) {
              if (element.desc == json.site.name) id = element.name;
            }, this);
            if (id === "") console.error("No site has been found with the specified name");
            mcache.put('siteId', id);
            authorizeDevice(id, mac, token, finalCookie);
          });

        });
      }

    }
    else authorizeDevice(json.site.id, mac, token, finalCookie);


  });
  loginRequest.write(login);
  loginRequest.end();
}

function authorizeDevice(site, mac, token, finalCookie) {
  let data = JSON.stringify({
    "mac": mac,
    "cmd": "authorize-guest"
  });
  let authDeviceRequest = https.request({
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
    path: '/api/s/' + site + '/cmd/stamgr'
  }, function (authResponse) {
    logoutFromController(server);
  });
  authDeviceRequest.write(data);
  authDeviceRequest.end();
}

function logoutFromController(server) {
  let logoutRequest = https.request({
    host: server,
    port: 8443,
    rejectUnauthorized: false,
    path: '/logout',
    method: 'GET'
  });
  logoutRequest.end();
}
module.exports = router;
