const { Router } = require('express');

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
    }).populate('payload.clientId');

    const result = tokens.map(token => token.toJSON());

    return res.json(result);
  },
);

module.exports = router;
