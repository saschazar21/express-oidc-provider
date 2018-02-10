const error = require('debug')('error');

const AccessToken = require('../db/models/accessTokens');

const find = async (accessToken) => {
  const token = accessToken.substr(0, 48);
  const signature = accessToken.replace(token, '');
  if (token.length + signature.length !== accessToken.length) {
    throw new Error('Something went wrong while evaluating the access token!');
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
    error(`No valid token found: ${token}`);
    return null;
  }
  return result;
};

module.exports = async (scopes, req, res, next) => {
  const s = Array.isArray(scopes) ? scopes : [scopes];
  const auth = req.get('authorization');
  if (!auth) {
    error('No authorization header present.');
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).send('Unauthorized');
  }

  const token = auth.replace(/^Bearer\s/i, '');
  const result = await find(token);

  if (!result) {
    return res.status(403).send('Invalid token');
  }

  const availableScopes = result.payload.scope ? result.payload.scope.split(' ') : [];
  const matched = availableScopes.filter(scope => s.indexOf(scope) >= 0);

  if (matched.length !== s.length) {
    error(`Scopes: ${availableScopes.join()} vs. ${s.join()}`);
    error(`${matched.length} vs. ${s.length}`);
    return res.status(403).send('Forbidden');
  }

  req.token = result;
  return next();
};
