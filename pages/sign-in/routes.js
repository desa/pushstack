var debug = require('debug')("pushstack:signin");

module.exports = function(app) {

  app.get("/signin", function(req, res) {
    debug("Rendering Sign-in page view");
    res.render(__dirname + "/view");
  });

};
