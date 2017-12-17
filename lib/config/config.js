const claims = require('./claims');
const clients = require('./clients');
const features = require('./features');
const keystore = require('./keystore');
const ttl = require('./ttl');

const adapter = require('../db/setup/adapter');

module.exports = {
  adapter,
  claims,
  clients,
  features,
  keystore,
  ttl,
};
