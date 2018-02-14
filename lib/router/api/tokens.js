const { Router } = require('express');
const error = require('debug')('error');

const Token = require('../../db/models/accessTokens');
const scopes = require('../../auth/middleware');

const router = Router();

router.get(
  '/',
  async (req, res, next) => scopes(['token'], req, res, next),
  async (req, res) => {
    const tokens = await Token.find({
      $and: [
        { 'payload.accountId': req.user.email },
        { 'payload.exp': { $gt: Date.now() * 0.001 } },
      ],
    });

    if (!tokens.length) {
      error('No tokens found');
      return res.status(404).send('No valid tokens found');
    }

    const result = tokens.map(token => token.toJSON());

    return res.json(result);
  },
);

module.exports = router;
