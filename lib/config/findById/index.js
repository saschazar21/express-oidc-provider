/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const User = require('../../db/models/users');

module.exports = async function findById(ctx, id, token) {
  const user = await User.findById(id);
  return {
    accountId: user._id,
    claims: async () => Object({
      sub: user._id,
    }),
  };
};
