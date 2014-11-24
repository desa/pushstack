var _ = require('underscore');
var fs = require('fs');
var logfmt = require("logfmt");

var bodyParser = require('body-parser');
var express = require('express');

var session = require('express-session');
var RedisStore = require("connect-redis")(session);
var stylus = require('stylus');

var debug = require('debug')('pushstack:server');
var port = Number(process.env.PORT || 5000);

var app = express();

var h = require(__dirname + "/lib/helpers")(app);
var errors = require(__dirname + "/lib/errors")(app);

app.use(logfmt.requestLogger());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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
app.set('redis', h.redisClient());

if (process.env.NODE_ENV === "production") {
  app.set("host", (process.env.HOST || "pushstack.herokuapp.com"));
  app.use(session({
    secret: (process.env.SESSION_SECRET || "my secret"),
    fingerprint: function(){},
    store: new RedisStore({
      client: app.get('redis'),
      db: 1
    }),
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
    store: new RedisStore({
      client: app.get('redis'),
      db: 1
    }),
    secret: "my secret",
    cookie: {httpOnly: true},
    key: 'pushstack-development.sid'
  }));
};

var pages = ['sign-in', 'q-and-a'];
_.each(pages, function(page) {
  require(__dirname + "/pages/" + page + "/routes")(app);
});


app.use(errors.handler);

app.listen(port, function() {
  console.log("Listening on " + port);
});

module.exports = app;