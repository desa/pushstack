var bodyParser = require('body-parser').urlencoded({ extended: false });

module.exports = function(app) {
  var h = require(__dirname + "/../../lib/helpers")(app);

  app.get("/login", function(req, res) {
    if (req.session.student) return res.redirect("/");
    res.locals = {
      session: req.session
};
    res.render(__dirname + "/view");
  });

  app.post("/login", bodyParser, function(req, res, next) {
    if (req.session.student) return res.redirect("/");

    function sendError(err) {
      req.session.message = err;
      return res.redirect("/login");
    }
    console.log("BODY", req.body)
    if (!req.body) return sendError("no data sent");
    if (!req.body.student) return sendError("Please enter your name");

    req.session = {
      student: req.body.student
    };
    var path = (req.session.classDay === h.classDay())? "/signin" : "/";
    return res.redirect(path);

  });

  app.get("/logout", function(req, res, next) {
    if (!req.session) return res.redirect("/login");
    req.session.destroy(function(err) {
      if (err) return next(err);
      res.redirect("/login");
    });
  });








}
