var fs = require('fs');
var logfmt = require("logfmt");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = Number(process.env.PORT || 5000);

app.use(logfmt.requestLogger())
app.use(bodyParser());
app.use('/', express.static(__dirname));

app.listen(port, function() {
  console.log("Listening on " + port);
});
