/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_session"] }] */
const { Router } = require('express');
const error = require('debug')('error');
const info = require('debug')('info');

const AccessToken = require('../db/models/accessTokens');
const Client = require('../db/models/clients');
const RedisAdapter = require('../db/adapter/redisAdapter');
const User = require('../db/models/users');
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

router.get('/clients', passport.isAuthenticated, async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.session.passport.user.sub });
    if (!user) {
      throw new Error(`No user found: ${req.session.passport.user.sub}`);
    }
  } catch (e) {
    return res.render('error', { error: e });
  }
  const c = await Client.find({ owner: user._id }).populate('owner');
  return res.render('clients', {
    ...req.session.passport,
    c,
  });
});

router.get('/tokens', passport.isAuthenticated, async (req, res) => {
  const tokens = await AccessToken.find({
    $and: [{
      'payload.accountId': req.session.passport.user.sub,
    }, {
      'payload.exp': {
        $gt: Math.floor(Date.now() * 0.001),
      },
    }],
  })
    .populate('payload.clientId');
  info(tokens);
  return res.render('tokens', {
    ...req.session.passport,
    tokens,
  });
});

router.get('/', passport.isAuthenticated, filterClient, async (req, res) => {
  let user;
  const tokens = await AccessToken.find({
    $and: [{
      'payload.accountId': req.session.passport.user.sub,
    }, {
      'payload.exp': {
        $gt: Math.floor(Date.now() * 0.001),
      },
    }],
  });

  try {
    user = await User.findOne({ email: req.session.passport.user.sub });
    if (!user) {
      throw new Error(`No user found: ${req.session.passport.user.sub}`);
    }
  } catch (e) {
    return res.render('error', { error: e });
  }
  const userClients = await Client.find({ owner: req.session.passport.user.sub });
  const data = {
    ...req.session.passport,
    clients: userClients.length,
    tokens: tokens.length,
  };

  return res.render('dashboard', data);
});

module.exports = router;
