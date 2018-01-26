const acrValues = require('./acrValues');
const claims = require('./claims');
const clients = require('./clients');
const features = require('./features');
const findById = require('./findById');
const keystore = require('./keystore');
const renderError = require('./renderError');
const scopes = require('./scopes');
const ttl = require('./ttl');

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
  renderError,
  scopes,
  ttl,
};
