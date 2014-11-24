var url = require('url');
var redis = require('redis');
var students = require(__dirname + "/students.json");
var moment = require('moment');
module.exports = function(app) {
  var getPassword, redisClient, ensureSignedIn,
      exports = {};

  getPassword = function(auth) {
    var auth = auth || "";
    return auth.split(":")[1] || "";
  }

  exports.redisClient = function() {
    if (!process.env.REDISTOGO_URL) {
      return redis.createClient();
    };
    var redisURL = url.parse(process.env.REDISTOGO_URL);
    var options = { auth_pass: getPassword(redisURL.auth)};
    return redis.createClient(redisURL.port, redisURL.hostname, options);
  }

  exports.classDay = function() {
    return moment().hours(0).minutes(0).seconds(0).milliseconds(0);
  }

  exports.ensureLoggedIn = function(req, res, next) {
    if (!req.session.student) return res.redirect("/login");
    return next();
  }

  return exports;
};
