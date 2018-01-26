const { Router } = require('express');

const passport = require('../auth');

const router = Router();

router.get('/callback', passport.authenticate('oidc', {
  failureRedirect: '/web/login',
  successRedirect: '/web',
}));

router.get('/login', passport.authenticate('oidc'));

router.get('/', passport.isAuthenticated, async (req, res) => {
  return res.send('Hello world');
});

module.exports = router;
