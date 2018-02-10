/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const { Router } = require('express');
const error = require('debug')('error');
const info = require('debug')('info');

const Client = require('../../db/models/clients');
const User = require('../../db/models/users');
const scopes = require('../../auth/middleware');

const router = Router();

const findUser = async (req, res, next) => {
  const user = await User.findOne({ email: req.token.payload.accountId });
  if (!user) {
    error(`No user found: ${req.token.payload.accountId}`);
    return res.status(500).send('Internal Server Error');
  }
  req.user = user.toJSON();
  return next();
};

router.get(
  '/',
  async (req, res, next) => scopes(['client'], req, res, next),
  findUser,
  async (req, res) => {
    const clients = await Client.find({ owner: req.user._id });
    const c = Array.isArray(clients) ? clients.map(client => Object({
      ...client.toJSON(),
      client_secret: null,
    })) : [];
    return res.json(c);
  },
);

router.get(
  '/:id',
  async (req, res, next) => scopes(['client'], req, res, next),
  findUser,
  async (req, res) => {
    const client = await Client.findOne({
      $and: [
        { owner: req.user._id },
        { _id: req.params.id },
      ],
    });

    if (!client) {
      error(`No client found: ${req.params.id}`);
      return res.status(404).send('Not found');
    }

    const result = {
      ...client.toJSON(),
      client_secret: null,
    };
    return res.json(result);
  },
);

router.get(
  '/:id/reset',
  async (req, res, next) => scopes(['client', 'client:update'], req, res, next),
  findUser,
  async (req, res) => {
    const client = await Client.findOne({
      $and: [
        { owner: req.user._id },
        { _id: req.params.id },
      ],
    });

    if (!client) {
      error(`No client found: ${req.params.id}`);
      return res.status(404).send('Not found');
    }


    const secret = await client.resetPassword().catch(e => res.status(500).send(e.message || e));
    const result = {
      ...client.toJSON(),
      client_secret: secret,
    };

    info('Reset client secret');

    return res.json(result);
  },
);

router.put(
  '/:id/update',
  async (req, res, next) => scopes(['client', 'client:update'], req, res, next),
  findUser,
  async (req, res) => {
    if (req.body.client_secret) {
      error(`Tried to update client_secret on ${req.params.id}`);
      return res.status(403).send('Updating client secret is not allowed.');
    }

    const result = await Client.findOneAndUpdate({
      $and: [
        { owner: req.user._id },
        { _id: req.params.id },
      ],
    }, {
      $set: req.body,
    }, {
      runValidators: true,
      new: true,
      upsert: false,
    });

    if (!result) {
      error(`Updating client ${req.params.id} failed`);
      return res.status(400).send('Client update failed');
    }

    const r = {
      ...result.toJSON(),
      client_secret: null,
    };
    return res.json(r);
  },
)

module.exports = router;
