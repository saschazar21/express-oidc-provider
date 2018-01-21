const info = require('debug')('info');
const { Router } = require('express');

const User = require('../db/models/users');

const router = Router();

module.exports = (provider) => {
  router.get('/interaction/:grantId', async (req, res) => {
    const details = await provider.interactionDetails(req);
    const interaction = details.interaction.reason === 'consent_prompt' || details.interaction.reason === 'client_not_authorized';
    info(details);

    const view = interaction ? 'interaction' : 'login';
    return res.render(view, details);
  });

  router.post('/interaction/:grantId/submit', async (req, res, next) => {
    // const user = await User.findById(req.body.email);

    const result = {
      consent: {},
      login: {
        account: req.body.email,
        acr: 'urn:oid:level:bronze',
        amr: ['pwd'],
        remember: !!req.body.remember,
        ts: Math.floor(Date.now() * 0.001),
      },
    };

    return provider.interactionFinished(req, res, result)
      .then(() => next());
  });

  return router;
};
