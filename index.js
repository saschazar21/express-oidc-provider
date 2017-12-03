const { argv } = require('yargs');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('./lib/config');
const dotenv = require('dotenv');
const express = require('express');
const info = require('debug')('info');
const morgan = require('morgan');
const path = require('path');
const redis = require('./lib/tools/redis');
const session = require('express-session');

const Provider = require('oidc-provider');

try {
  dotenv.config({
    path: path.resolve(__dirname, './env'),
  });
} catch (e) {
  info('Parsing ENV files failed!');
  info(e);
}
const DEV = argv.dev || argv.env === 'dev' || process.env.NODE_ENV === 'development';
const DOMAIN = argv.h || argv.host || process.env.DOMAIN || process.env.HOST || 'localhost';
const PORT = argv.p || argv.port || process.env.PORT || 3000;

const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(compression({ level: 6 }));
app.use(session({
  cookie: { secure: true },
  proxy: true,
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'K1ng_0f_Hop$',
  store: redis,
  unset: 'destroy',
}));

const oidc = new Provider(`${DEV ? 'http://' : 'https://'}${DOMAIN}${DEV ? (`:${PORT}`) : ''}`);
oidc.initialize(config)
  .then(() => {
    app.use('/', oidc.callback);
    app.listen(PORT, (err) => {
      if (err) {
        throw new Error(`An error occurred: ${err.message || err}`);
      }
      return info(`OpenID Connect provider successfully started at ${DOMAIN}${DEV ? (`:${PORT}`) : ''}`);
    });
  });
