/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_session"] }] */
const { Router } = require('express');
const error = require('debug')('error');
const info = require('debug')('info');

const passport = require('../auth');
const RedisAdapter = require('../db/adapter/redisAdapter');

const redis = new RedisAdapter();
const router = Router();

router.get('/callback', passport.authenticate('oidc', {
  failureRedirect: '/login',
  successRedirect: '/web',
}));

router.get('/login', passport.authenticate('oidc'));

router.get('/logout', async (req, res) => {
  try {
    await redis.destroy(req.cookies._session);
    info(`Successfully destroyed session: ${req.cookies._session}`);
  } catch (e) {
    error(e);
    error(`Destroying session ${req.cookies._session} failed`);
  }
  req.logout();
  return res.redirect('/');
});

module.exports = router;
