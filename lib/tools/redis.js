const Promise = require('bluebird');
const info = require('debug')('info');
const redis = Promise.promisifyAll(require('redis'));
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const config = {
  path: process.env.REDIS_SOCKET,
  url: `redis://redistogo:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};

if (process.env.REDIS_SOCKET) {
  delete config.url;
} else {
  delete config.socket;
}

const client = redis.createClient(config);
const store = new RedisStore({ client });
client.on('error', err => new Error(err.message || err));
client.on('ready', () => info(`Redis connection to ${config.url || config.path} successful.`));

if (process.env.NODE_ENV === 'development') {
  client.setAsync('TEST_KEY', new Date(Date.now()).toISOString())
    .then(data => info(`Redis query to insert into TEST_KEY successful: ${data}`))
    .then(() => client.getAsync('TEST_KEY'))
    .then(data => info(`Value of TEST_KEY is: ${data}`));
}

module.exports = store;
