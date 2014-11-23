var fs = require('fs');
var logfmt = require("logfmt");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = Number(process.env.PORT || 5000);
var stylus = require('stylus');

app.use(logfmt.requestLogger());
app.use(bodyParser());

app.use(stylus.middleware, {
  src: __dirname + "/assets",
  dest: __dirname + "/public",
  compile: function(str, path) {
    var styl = stylus(str)
               .set('filename', path)
               .import('_settings')
               .use(require('axis-css'));
    return styl;
  }
});

app.use(express.static(__dirname + "/public"));

app.listen(port, function() {
  console.log("Listening on " + port);
});
