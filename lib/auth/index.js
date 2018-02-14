const error = require('debug')('error');
const info = require('debug')('info');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { Issuer, Strategy } = require('openid-client');

const AccessToken = require('../db/models/accessTokens');
const User = require('../db/models/users');
const clientModel = require('../config/clients')[0];
const domainConfig = require('../tools/domain');

const domain = `${domainConfig.PROTOCOL}${domainConfig.DOMAIN}`;
const fqdn = `${domain}${domainConfig.PORT ? `:${domainConfig.PORT}` : ''}`;

const issuer = new Issuer({
  issuer: fqdn,
  authorization_endpoint: `${fqdn}/auth`,
  token_endpoint: `${fqdn}/token`,
  userinfo_endpoint: `${fqdn}/me`,
  jwks_uri: `${fqdn}/certs`,
});

info(issuer);

const client = new issuer.Client({
  client_id: clientModel.client_id,
  client_secret: clientModel.client_secret,
  redirect_uris: clientModel.redirect_uris,
  response_types: clientModel.response_types,
});

const params = {
  scope: 'openid profile client client:create client:update client:delete token',
};

passport.use('bearer', new BearerStrategy(async (accessToken, done) => {
  const token = accessToken.substr(0, 48);
  const signature = accessToken.replace(token, '');
  if (token.length + signature.length !== accessToken.length) {
    return done(new Error('Something went wrong while evaluating the access token!'));
  }

  const result = await AccessToken.findOne({
    $and: [
      { _id: token },
      {
        'payload.exp': {
          $gt: Math.floor(Date.now() * 0.001),
        },
      },
      { signature },
    ],
  });

  if (!result) {
    const err = new Error(`No valid token found: ${token}`);
    error(err.message);
    return done(new Error('No valid token found'));
  }
  const t = result.toJSON();
  const user = await User.findOne({ email: t.payload.accountId });

  if (!user) {
    const err = new Error(`No user found: ${t.payload.accountId}`);
    error(err.message);
    return done(new Error('No valid user found'));
  }

  const u = {
    ...user.toJSON(),
    scope: t.payload.scope,
    password: null,
  };

  return done(null, u);
}));

passport.use('oidc', new Strategy({ client, params }, async (tokenSet, userInfo, done) => {
  const user = await User.findOne({ email: tokenSet.claims.sub });

  if (!user) {
    return done(new Error(`No user found with email: ${tokenSet.claims.sub}`));
  }

  return done(null, {
    ...tokenSet.claims,
    access_token: tokenSet.access_token,
    scope: tokenSet.scope,
  });
}));

passport.isAuthenticated = (req, res, next) => {
  if (req.path.startsWith('/login')) {
    return next();
  }
  if (req.user) {
    return next();
  }
  return res.status(401).redirect('/login');
};

passport.deserializeUser(async (profile, done) => {
  const user = User.findOne({ email: profile.sub });

  if (!user) {
    return done(new Error(`No profile found with email: ${profile.sub}`));
  }
  return done(null, profile);
});

passport.serializeUser((profile, done) => done(null, profile));

module.exports = passport;
