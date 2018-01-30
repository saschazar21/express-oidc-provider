/* eslint no-underscore-dangle: ["error", { "allow": ["_session"] }] */
const { Router } = require('express');
const error = require('debug')('error');
const info = require('debug')('info');

const Client = require('../db/models/clients');
const RedisAdapter = require('../db/adapter/redisAdapter');
const clients = require('../config/clients');
const passport = require('../auth');

const redis = new RedisAdapter();
const router = Router();

const filterClient = async (req, res, next) => {
  let client;

  if (req.session.client) {
    return next();
  }

  try {
    const clientId = req.session.passport.user.aud;
    const hardcoded = clients.filter(c => c.client_id === clientId);
    client = hardcoded.length ? hardcoded[0] : await Client.findById(clientId);
    if (!client) {
      return res.render('error', { error: new Error(`No client found with ID: ${clientId}`) });
    }
    req.session.client = client;
    return next();
  } catch (e) {
    return res.render('error', { error: e });
  }
};

router.get('/callback', passport.authenticate('oidc', {
  failureRedirect: '/web/login',
  successRedirect: '/web',
}));

router.get('/login', passport.authenticate('oidc'));

router.get('/logout', async (req, res) => {
  try {
    await redis.destroy(req.cookies._session);
    info(`Successfully destroyed session: ${req.cookies._session}`);
  } catch (e) {
    error('Session destroy failed:');
    error(e);
  }
  req.logout();
  return res.redirect('/web/login');
});

router.get('/', passport.isAuthenticated, filterClient, async (req, res) => {
  const data = {
    ...req.session.passport,
    client: req.session.client,
  };

  return res.render('dashboard', data);
});

module.exports = router;
