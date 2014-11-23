var debug = require('debug')("pushstack:q-and-a");

module.exports = function(app) {

  app.get("/q-and-a", function(req, res) {
    debug("Rendering Q and A page view");
    res.render(__dirname + "view");
  }

}
