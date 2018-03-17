/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const { Router } = require('express');
const error = require('debug')('error');
const info = require('debug')('info');

const Client = require('../../db/models/clients');
const oidc = require('../../provider');
const scopes = require('../../auth/middleware');

const router = Router();

router.get(
  '/',
  async (req, res, next) => scopes(['client'], req, res, next),
  async (req, res) => {
    let clients;
    try {
      clients = await Client.find({ owner: req.user._id }, '-client_secret')
        .populate('owner', '-password');
    } catch (e) {
      error(e.message || e);
      return res.status(400).send(e.message || e);
    }
    return res.json(clients);
  },
);

router.post(
  '/',
  async (req, res, next) => scopes(['client', 'client:create'], req, res, next),
  async (req, res) => {
    if (req.body.client_secret || req.body._id) {
      error('Tried to create client w/ _id or client_secret');
      return res.status(403).send('Creating client with client secret and/or _id is not allowed.');
    }

    const client = {
      ...req.body,
      owner: req.user._id,
    };

    let result;
    try {
      result = await Client.create(client);
    } catch (e) {
      error(e.message || e);
      return res.status(400).send(e.message || e);
    }
    info(`Client ${result.get('_id')} successfully created.`);
    return res.json(result.toJSON());
  },
);

router.get(
  '/:id',
  async (req, res, next) => scopes(['client'], req, res, next),
  async (req, res) => {
    try {
      const client = await Client.findById(req.params.id, '-client_secret');
      return res.json(client.toJSON());
    } catch (e) {
      error(`No client found: ${req.params.id}`);
      return res.status(400).send(e.message || e);
    }
  },
);

router.get(
  '/:id/reset',
  async (req, res, next) => scopes(['client', 'client:update'], req, res, next),
  async (req, res) => {
    let client;
    let secret;
    try {
      client = await Client.findOne({
        $and: [
          { owner: req.user._id },
          { _id: req.params.id },
        ],
      });
      secret = await client.resetPassword();
    } catch (e) {
      error(`No client found: ${req.params.id}`);
      return res.status(400).send(e.message || e);
    }

    const result = {
      ...client.toJSON(),
      client_secret: secret,
    };

    info('Reset client secret');

    oidc.Client.cacheClear(req.params.id);
    return res.json(result);
  },
);

router.put(
  '/:id',
  async (req, res, next) => scopes(['client', 'client:update'], req, res, next),
  async (req, res) => {
    if (req.body.client_secret || req.body._id) {
      error(`Tried to update _id or client_secret on ${req.params.id}`);
      return res.status(403).send('Updating client secret and/or _id is not allowed.');
    }

    let result;
    try {
      result = await Client.findOneAndUpdate({
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
    } catch (e) {
      error(`Updating client ${req.params.id} failed`);
      return res.status(400).send(e.message || e);
    }

    const r = {
      ...result.toJSON(),
      client_secret: null,
    };
    oidc.Client.cacheClear(req.params.id);
    return res.json(r);
  },
);

router.delete(
  '/:id',
  async (req, res, next) => scopes(['client', 'client:delete'], req, res, next),
  async (req, res) => {
    let result;
    try {
      result = await Client.findOneAndRemove({
        $and: [
          { owner: req.user._id },
          { _id: req.params.id },
        ],
      });
    } catch (e) {
      error(`Deleteing client ${req.params.id} failed`);
      return res.status(400).send(e.message || e);
    }
    info(`Client ${result.client_name}: ${result._id} successfully deleted.`);

    oidc.Client.cacheClear(req.params.id);
    return res.json({
      id: req.params.id,
      success: true,
    });
  },
);

module.exports = router;
