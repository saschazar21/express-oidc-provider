const auth = require('./auth');
const oidc = require('./oidc');

module.exports = provider => Object({
  auth,
  oidc: oidc(provider),
});
