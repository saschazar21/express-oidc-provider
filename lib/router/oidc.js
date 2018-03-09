const error = require('debug')('error');
const { Router } = require('express');

const nuxt = require('../vue');
const User = require('../db/models/users');

const router = Router();

module.exports = (provider) => {
  router.get('/interaction/:grantId', async (req, res) => {
    const details = await provider.interactionDetails(req);
    const interaction = details.interaction.reason === 'consent_prompt' || details.interaction.reason === 'client_not_authorized';
    const view = interaction ? '/interaction' : '/login';
    req.session[req.params.grantId] = details;
    return res.redirect(`/web${view}/${req.params.grantId}`);
  });

  router.post('/interaction/:grantId/submit', async (req, res, next) => {
    let data = null;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const msg = `No user found with email: ${req.body.email}`;
      error(msg);
      data = data || {
        message: msg,
        returnTo: req.header('Referer') || '/',
        status: 403,
      };
      const request = {
        ...req,
        error: data,
      };
      const tpl = await nuxt.renderRoute('error', { req: request, res });
      return res.send(tpl.html);
    }

    const password = req.body.password || null;
    if (!password || password.length < 1) {
      const msg = 'No password entered';
      error(msg);
      data = data || {
        message: msg,
        returnTo: req.header('Referer') || '/',
        status: 401,
      };
      const request = {
        ...req,
        error: data,
      };
      const tpl = await nuxt.renderRoute('error', { req: request, res });
      return res.send(tpl.html);
    }

    const correctPassword = await user.correctPassword(password);
    if (!correctPassword) {
      const msg = 'Wrong password!';
      error(msg);
      data = data || {
        message: msg,
        returnTo: req.header('Referer') || '/',
        status: 401,
      };
      const request = {
        ...req,
        error: data,
      };
      const tpl = await nuxt.renderRoute('error', { req: request, res });
      return res.send(tpl.html);
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

  router.post('/interaction/:grantId/confirm', async (req, res) => {
    const result = {};
    return provider.interactionFinished(req, res, result);
  });

  return router;
};
