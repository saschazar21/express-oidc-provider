const Promise = require('bluebird');
const info = require('debug')('info');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const HOST = process.env.MONGO_HOST;
const DBNAME = process.env.MONGO_DBNAME;

const options = {
  auth: {
    username: process.env.MONGO_USER || null,
    password: process.env.MONGO_PASSWORD || null,
  },
  server: {
    auto_reconnect: true,
  },
  useMongoClient: true,
};

info(`Attempting to connect to ${HOST} on port ${process.env.MONGO_PORT} with user ${process.env.MONGO_USER}...`);
const db = mongoose.createConnection(HOST, DBNAME, process.env.MONGO_PORT, options);
db.on('connected', () => info(`Successfully connected to MongoDB ${process.env.MONGO_HOST} with user ${process.env.MONGO_USER}.`));
db.on('error', err => new Error(err.message || err));

module.exports = mongoose;
