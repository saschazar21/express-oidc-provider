const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const error = require('debug')('error');
const express = require('express');
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
const domain = require('./lib/tools/domain');
const { isDev } = require('./lib/tools/validators');
const passport = require('./lib/auth');
const router = require('./lib/router');
const { store } = require('./lib/tools/redis');

const app = express();
app.set('trust proxy', 1);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(compression({ level: 6 }));
app.use(session({
  cookie: { secure: !isDev },
  proxy: true,
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'K1ng_0f_Hop$',
  store,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use('/assets', express.static('public'));

const oidc = new Provider(`${isDev ? 'http://' : 'https://'}${domain.DOMAIN}${isDev ? (`:${domain.PORT}`) : ''}`, config);
oidc.initialize({
  clients: config.clients,
  adapter: config.adapter,
  keystore: config.keystore,
})
  .then(() => {
    oidc.app.proxy = true;
    const routes = router(oidc);
    app.use((req, res, next) => {
      if (req.session) {
        info('Session WebClient');
        info(req.session);
        return next();
      }
      return res.render('error', { error: new Error('Session is gone!') });
    });

    app.get('/', (req, res) => res.redirect('/web'));
    app.use('/web', routes.web);
    app.use('/', routes.oidc);
    app.use('/', oidc.callback);

    app.listen(domain.PORT, (err) => {
      if (err) {
        throw new Error(`An error occurred: ${err.message || err}`);
      }
      return info(`OpenID Connect provider successfully started at ${domain.DOMAIN}${isDev ? (`:${domain.PORT}`) : ''}`);
    });
  })
  .catch((e) => {
    error(e);
    console.error(e.message || e);
  });
