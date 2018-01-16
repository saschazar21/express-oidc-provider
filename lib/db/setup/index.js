const Promise = require('bluebird');
const info = require('debug')('info');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const HOST = process.env.MONGO_HOST;
const PORT = process.env.MONGO_PORT;
const DBNAME = process.env.MONGO_DBNAME;

const url = `mongodb://${HOST}${PORT ? `:${PORT}` : ''}${DBNAME ? `/${DBNAME}` : ''}`;

const options = {
  auth: {
    username: process.env.MONGO_USER || null,
    password: process.env.MONGO_PASSWORD || null,
  },
  user: process.env.MONGO_USER || null,
  pass: process.env.MONGO_PASSWORD || null,
  autoReconnect: true,
  useMongoClient: true,
};

info(`Attempting to connect to ${HOST} on port ${process.env.MONGO_PORT} with user ${process.env.MONGO_USER}...`);
mongoose.connect(url, options)
  .then(() => info(`Successfully connected to MongoDB ${process.env.MONGO_HOST} with user ${process.env.MONGO_USER}.`))
  .catch(err => new Error(err.message || err));

module.exports = mongoose;
