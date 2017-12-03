const info = require('debug')('info');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  socket: process.env.REDIS_SOCKET,
  pass: process.env.REDIS_PASSWORD || null,
  logErrors: process.env.NODE_ENV === 'development',
  ttl: 3600,
};

if (process.env.REDIS_SOCKET) {
  delete config.host;
  delete config.port;
} else {
  delete config.socket;
}

const store = new RedisStore(config);
store.on('error', err => new Error(err.message || err));
store.on('ready', () => info(`Redis connection to ${config.host || config.socket} successful.`));

module.exports = store;
