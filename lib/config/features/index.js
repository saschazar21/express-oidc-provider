const { v4 } = require('uuid');

module.exports = {
  claimsParameter: true,
  devInteractions: process.env.NODE_ENV === 'development',
  discovery: process.env.NODE_ENV === 'development',
  encryption: process.env.NODE_ENV !== 'development',
  introspection: true,
  pkce: true,
  registration: {
    idFactory: v4,
    initialAccessToken: true,
  },
  request: true,
  revocation: true,
  sessionManagement: true,
};
