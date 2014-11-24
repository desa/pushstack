var url = require('url');
var redis = require('redis');

var getPassword = function(auth) {
  var auth = auth || "";
  return auth.split(":")[1] || "";
}

var redisClient = function() {
  if (!process.env.REDISTOGO_URL) {
    return redis.createClient();
  };
  var redisURL = url.parse(process.env.REDISTOGO_URL);
  var options = { auth_pass: getPassword(redisURL.auth)};
  return redis.createClient(redisURL.port, redisURL.hostname, options);
}

module.exports = function(app) {
  return {
  getPassword: getPassword,
  redisClient: redisClient
  };
};