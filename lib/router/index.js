const oidc = require('./oidc');
const web = require('./web');

module.exports = provider => Object({
  oidc: oidc(provider),
  web,
});
