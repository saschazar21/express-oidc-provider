/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const info = require('debug')('info');
const User = require('../../db/models/users');

module.exports = async function findById(ctx, id) {
  info(`Find user ${id}`);
  info(ctx);
  const user = await User.findById({ email: id });
  return {
    accountId: user.email,
    claims: async () => Object({
      sub: user.email,
      preferred_username: user.preferred_username,
    }),
  };
};
