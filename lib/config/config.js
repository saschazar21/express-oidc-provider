const acrValues = require('./acrValues');
const claims = require('./claims');
const clients = require('./clients');
const features = require('./features');
const findById = require('./findById');
const keystore = require('./keystore');
const ttl = require('./ttl');

// const adapter = require('../db/setup/adapter');
const adapter = require('../db');

const interactionUrl = ctx => `/interaction/${ctx.oidc.uuid}`;

module.exports = {
  acrValues,
  adapter,
  claims,
  clients,
  features,
  findById,
  interactionUrl,
  keystore,
  ttl,
};
