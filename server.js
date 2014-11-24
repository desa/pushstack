var _ = require('underscore');
var fs = require('fs');
var logfmt = require("logfmt");

var bodyParser = require('body-parser');
var express = require('express');

var session = require('express-session');
var RedisStore = require("connect-redis")(session);
var stylus = require('stylus');

var debug = require('debug')('pushstack:server');
var port = Number(process.env.PORT || 35729);
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var node_env = process.env.NODE_ENV;
var GITHUB_CLIENT_ID = (node_env === 'production')? "7d81a353395947aebfd7": "b32b5f4cef58115b14e1"
var GITHUB_CLIENT_SECRET = (node_env === 'production')? "ead6d9fa503fccc181f02b5ce6068deb0fea25ba": "f93aa6d047433751432880e163f971d41044aa9e";
var host = process.env.HOST || (node_env === 'production')? 'https://pushstack.herokuapp.com': 'http://127.0.0.1:35729';
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: host + "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

var h = require(__dirname + "/lib/helpers")(app);
var errors = require(__dirname + "/lib/errors")(app);

app.use(logfmt.requestLogger());


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

app.use(passport.initialize());
app.use(passport.session());

var pages = ['index', 'auth', 'sign-in', 'q-and-a', 'auth/github'];
_.each(pages, function(page) {
  require(__dirname + "/pages/" + page + "/routes")(app);
});


app.use(errors.handler);

app.listen(port, function() {
  console.log("Listening on " + port);
});

module.exports = app;
