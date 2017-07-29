var fs = require('fs');

function readJsonFileSync(filepath, encoding) {
  if(typeof(encoding) == 'undefined') encoding = 'utf8';
  return JSON.parse(fs.readFileSync(filepath, encoding));
}

function getConfig(file) {
  var filePath = __dirname + '/' + file;
  return readJsonFileSync(filePath);
}
var json = getConfig('config.json');
module.exports = json;