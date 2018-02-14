const error = require('debug')('error');

module.exports = async (scopes, req, res, next) => {
  const s = Array.isArray(scopes) ? scopes : [scopes];
  const availableScopes = req.user.scope ? req.user.scope.split(' ') : [];

  const matched = availableScopes.filter(scope => s.indexOf(scope) >= 0);

  if (matched.length !== s.length) {
    error(`Scopes: ${availableScopes.join()} vs. ${s.join()}`);
    error(`${matched.length} vs. ${s.length}`);
    return res.status(403).send('Forbidden');
  }
  return next();
};
