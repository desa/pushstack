var debug = require('debug')("pushstack:index");

module.exports = function(app) {
  var h = require(__dirname + "/../../lib/helpers")(app);
  app.get("/", h.ensureLoggedIn, function(req, res) {
    res.locals = {
      session: req.session
    };
    res.render(__dirname + "/view");
  });

};
