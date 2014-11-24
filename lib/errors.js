

module.exports = function(app) {
  var errors = {};
  errors.handler = function(err, req, res, next) {
    if (typeof err === 'undefined') {
      return next();
    };
    console.error("Unknown Error: ", err);
    res.status(err.statusCode || 500);
    return res.send("Sorry! We encountered an unknown error.");
  }


  return errors
}
