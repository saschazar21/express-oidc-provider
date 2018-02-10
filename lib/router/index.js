const api = require('./api');
const auth = require('./auth');
const oidc = require('./oidc');

module.exports = provider => Object({
  api,
  auth,
  oidc: oidc(provider),
});
