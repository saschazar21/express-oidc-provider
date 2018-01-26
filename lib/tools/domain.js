const { argv } = require('yargs');

const { isDev } = require('./validators');

const port = isDev ? (process.env.PORT || 3000) : (process.env.PORT || null);

module.exports = {
  PROTOCOL: isDev ? 'http://' : 'https://',
  DOMAIN: argv.h || argv.host || process.env.DOMAIN || process.env.HOST || 'localhost',
  PORT: argv.p || argv.port || port,
  baseUrl: isDev ? `http://localhost:${process.env.PORT || 3000}` : `https://${process.env.DOMAIN}:${process.env.PORT || 443}`,
};
