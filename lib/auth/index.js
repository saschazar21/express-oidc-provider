const passport = require('passport');
const { Issuer, Strategy } = require('openid-client');

const User = require('../db/models/users');
const clientModel = require('../config/clients')[0];
const domainConfig = require('../tools/domain');

const domain = `${domainConfig.PROTOCOL}${domainConfig.DOMAIN}`;
const fqdn = `${domain}${domainConfig.PORT ? `:${domainConfig.PORT}` : ''}`;

const issuer = new Issuer({
  issuer: domain,
  authorization_endpoint: `${fqdn}/auth`,
  token_endpoint: `${fqdn}/token`,
  userinfo_endpoint: `${fqdn}/me`,
  jwks_uri: `${fqdn}/certs`,
});

const client = new issuer.Client({
  client_id: clientModel.client_id,
  client_secret: clientModel.client_secret,
  redirect_uris: clientModel.redirect_uris,
  response_types: clientModel.response_types,
});

const params = {
  scope: 'openid profile',
};

passport.use('oidc', new Strategy({ client, params }, async (tokenSet, userInfo, done) => {
  const user = await User.findOne({ email: tokenSet.claims.sub });

  if (!user) {
    return done(new Error(`No user found with email: ${tokenSet.claims.sub}`));
  }

  return done(null, {
    ...user.toJSON(),
    password: null,
  });
}));

passport.isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).redirect('/web/login');
};

passport.deserializeUser(async (profile, done) => {
  const user = User.findOne({ email: profile.email });

  if (!user) {
    return done(new Error(`No profile found with email: ${profile.email}`));
  }
  return done(null, {
    ...user.toJSON(),
    password: null,
  });
});

passport.serializeUser((profile, done) => done(null, profile.email));

module.exports = passport;