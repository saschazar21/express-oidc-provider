const oidc = require('./oidc');

module.exports = provider => Object({
  oidc: oidc(provider),
});
