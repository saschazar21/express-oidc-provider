/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const error = require('debug')('error');
const info = require('debug')('info');
const User = require('../../db/models/users');

module.exports = async function findById(ctx, id) {
  const user = await User.findOne({ email: id });
  if (!user) {
    const msg = `No user found with email: ${id}`;
    error(msg);
    throw new Error(msg);
  }

  const sanitized = user.toJSON();
  info('Found user:');
  info(sanitized);

  return {
    accountId: user.email,
    claims: () => Object({
      ...sanitized,
      password: null,
      sub: user.email,
    }),
  };
};
