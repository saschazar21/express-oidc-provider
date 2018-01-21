const { argv } = require('yargs');
const bodyParser = require('body-parser');
const compression = require('compression');
const error = require('debug')('error');
const express = require('express');
const hbs = require('hbs');
const info = require('debug')('info');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');

const Provider = require('oidc-provider');

try {
  /* eslint-disable global-require */
  require('dotenv').config();
  /* eslint-enable global-require */
} catch (e) {
  info('Parsing ENV files failed!');
  info(e);
}

const config = require('./lib/config/config');
const router = require('./lib/router');
const { store } = require('./lib/tools/redis');

const DEV = argv.dev || argv.env === 'dev' || process.env.NODE_ENV === 'development';
const DOMAIN = argv.h || argv.host || process.env.DOMAIN || process.env.HOST || 'localhost';
const PORT = argv.p || argv.port || process.env.PORT || 3000;

const app = express();
app.set('trust proxy', 1);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(compression({ level: 6 }));
app.use(session({
  cookie: { secure: true },
  proxy: true,
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'K1ng_0f_Hop$',
  store,
  unset: 'destroy',
}));
app.use('/assets', express.static('public'));

hbs.registerPartials(path.resolve(__dirname, 'views/partials'));
hbs.localsAsTemplateData(app);
app.locals.url = `${DEV ? 'http://' : 'https://'}${DOMAIN}${DEV ? (`:${PORT}`) : ''}`;

const oidc = new Provider(`${DEV ? 'http://' : 'https://'}${DOMAIN}${DEV ? (`:${PORT}`) : ''}`);
oidc.initialize(config)
  .then(() => {
    app.use('/', router(oidc).oidc);
    app.use('/', oidc.callback);

    app.listen(PORT, (err) => {
      if (err) {
        throw new Error(`An error occurred: ${err.message || err}`);
      }
      return info(`OpenID Connect provider successfully started at ${DOMAIN}${DEV ? (`:${PORT}`) : ''}`);
    });
  })
  .catch((e) => {
    error(e);
    console.error(e.message || e);
  });
