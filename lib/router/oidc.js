const error = require('debug')('error');
const info = require('debug')('info');
const { Router } = require('express');

const Client = require('../db/models/clients');
const clients = require('../config/clients');
const nuxt = require('../vue');
const passport = require('../auth');
const User = require('../db/models/users');

const router = Router();

module.exports = (provider) => {
  router.get('/callback', passport.authenticate('oidc', {
    failureRedirect: '/login',
    successRedirect: '/web',
  }));

  router.get('/login', passport.authenticate('oidc'));

  router.get('/interaction/:grantId', async (req, res) => {
    const details = await provider.interactionDetails(req);
    const c = {
      client: {},
    };

    try {
      const client = await Client.findById(details.params.client_id);
      c.client = client;
    } catch (e) {
      const hardcoded = clients.filter(client => client.client_id === details.params.client_id);
      if (hardcoded.length) {
        c.client = { ...hardcoded[0] };
      } else {
        error(`No client found on database: ${details.params.client_id}`);
      }
    }
    const interaction = details.interaction.reason === 'consent_prompt' || details.interaction.reason === 'client_not_authorized';
    const data = Object.assign(details, c);
    info(data);

    const view = interaction ? 'interaction' : 'login';
    return nuxt.renderRoute(view, data).then(result => res.send(result.html));
  });

  router.post('/interaction/:grantId/submit', async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const msg = `No user found with email: ${req.body.email}`;
      error(msg);
      const data = {
        error: new Error(msg),
        returnTo: req.header('Referer') || '/',
      };
      // return res.render('error', data);
    }

    const password = req.body.password || null;
    if (!password || password.length < 1) {
      const msg = 'No password entered';
      error(msg);
      const data = {
        error: new Error(msg),
        returnTo: req.header('Referer') || '/',
      };
      // return res.render('error', data);
    }

    const correctPassword = await user.correctPassword(password);
    if (!correctPassword) {
      const msg = 'Wrong password!';
      error(msg);
      const data = {
        error: new Error(msg),
        returnTo: req.header('Referer') || '/',
      };
      // return res.render('error', data);
    }

    const result = {
      consent: {
        // TODO: remove offline_access from scopes if remember is not checked
      },
      login: {
        account: user.email,
        acr: 'urn:oid:level:bronze',
        amr: ['pwd'],
        remember: !!req.body.remember,
        ts: Math.floor(Date.now() * 0.001),
      },
    };

    return provider.interactionFinished(req, res, result)
      .catch(() => next());
  });

  router.post('/interaction/:grantId/confirm', async (req, res) => provider.interactionFinished(req, res, {
    consent: {},
  }));

  return router;
};
