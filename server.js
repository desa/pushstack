var _ = require('underscore');
//var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var logfmt = require("logfmt");

var redis = require('redis');
var session = require('express-session');
var RedisStore = require("connect-redis")(session);
var stylus = require('stylus');
var url = require('url');


function herokuRedisStore() {
  var redisOptions;
  if (!process.env.REDISTOGO_URL) {
    redisOptions = {
      host: '127.0.0.1',
      port: 6379
    };
  } else {
    var redisURL = url.parse(process.env.REDISTOGO_URL);
    var redisAuth = redisURL.auth.split(":");
    redisOptions = {
      host: redisURL.hostname,
      port: redisURL.port,
      db: redisAuth[0],
      pass: redisAuth[1],
      ttl: 7200 
    };
  }
  return new RedisStore(redisOptions);
}


var port = Number(process.env.PORT || 5000);
var app = express();

app.use(logfmt.requestLogger());
//app.use(bodyParser());

app.use(stylus.middleware({
  src: __dirname + "/assets",
  dest: __dirname + "/public",
  compile: function(str, path) {
    var styl = stylus(str)
               .set('filename', path)
               .import('_settings')
               .use(require('axis-css'));
    return styl;
  }
}));

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'jade');

if (process.env.NODE_ENV === "production") {

  app.set("host", (process.env.HOST || "pushstack.herokuapp.com"));
  app.use(session({
    secret: (process.env.SESSION_SECRET || "my secret"),
    fingerprint: function(){},
    store: herokuRedisStore(),
    cookie: {
      domain: app.get('host'),
      secure: true,
      httpOnly: true
    },
    key: "poststack.sid"
  }));
} else {
  app.set('host', (process.env.HOST || 'localhost'));
  app.use(session({
    store: herokuRedisStore(),
    secret: "my secret",
    cookie: {httpOnly: true},
    key: 'pushstack-development.sid'
  }));
};

var pages = ['sign-in', 'q-and-a'];
for (var i = 0; i < pages.length; i++) {
  require(__dirname + "/pages/" + pages[i] + "/routes")(app);
};

app.use(function(err, req, res, next) {
  if (typeof err !== 'undefined') {
    console.error("Unknown error: ", err);
    res.status(err.statusCode || 500);
    return res.send("Unknown error");
  }
  return next();
});

app.listen(port, function() {
  console.log("Listening on " + port);
});

module.exports = app;