var passport = require('passport');


module.exports = function(app) {
  var h = require(__dirname + "/../../../lib/helpers");

  app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

  app.get('/auth/github/callback',
          passport.authenticate('github', { failureRedirect: '/login' }),
          function(req, res) {
            console.log("USER", JSON.stringify(req.user, null, 2));
            req.session.student = req.user.username;
            res.redirect('/');
          });

}
