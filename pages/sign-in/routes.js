var async = require('async'),
    debug = require('debug')("pushstack:signin"),
    moment = require('moment'),
    makeCode = require(__dirname + "/../../lib/code_generator")
    jsonParser = require('body-parser').json();

module.exports = function(app) {
  var redis = app.get('redis');
  var h = require(__dirname + "/../../lib/helpers")(app);
  function getOrSetCode(req, res, next) {
    var key = "signin-code-" + classDay;
    var code = null;
    async.auto({
      currCode: function(cb_a) { redis.get(key, cb_a); },
      usedKeys: function(cb_a) { redis.hgetall("used-keys", cb_a) },
      code: ["currCode", "usedKeys", function(cb_a, res) {
        var code = res.code,
            usedKeys = res.usedKeys || {};
         while (usedKeys[code] !== key) {
           code = makeCode();
         };
         redis.set(key, code)
         return cb_a(null, code);
      }]
    }, function (err, res) {
         if (err) return cb(err);
         var usedKeys = res.usedKeys || {};
         usedKeys[res.code] = key;
         redis.set("used-keys", usedKeys);
         return cb(null, res.code);
       });
  }

  function ensureCode(req, res, next) {
    if (req.code) return next();
    req.session.classday = classday;
    getOrSetCode(key, function(err, code) {
      return next(err);
      req.code = code;
      return next();
    });
  }
  app.post("/signin", jsonParser, h.ensureLoggedIn, function(req, res) {
    var student;
    function sendError(err) {
      req.session.message = err;
      return req.redirect("/signin");
    }
    if (!req.body) return sendError("no data sent");

    student = req.session.student;

    if (!student) return sendError("Please enter your name.");
    req.session.student = student;

    if (!req.body.code) return sendError("Please enter the code for the day.");
    if (req.body.code !== req.code) return sendError("Incorrect Code");
    req.session.signedIn = true;
  });

  app.get("/signin", h.ensureLoggedIn, function(req, res) {
    if (req.session.classDay === h.classDay()) {
      res.session.message = "You already signed in for today."
      req.redirect("/");
    }
    debug("Rendering Sign-in page view");
    res.locals = {
      moment: require('moment'),
      session: req.session
    };
    res.render(__dirname + "/view");
  });

};
