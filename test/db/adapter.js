const info = require('debug')('info');
const { argv } = require('yargs');

try {
  /* eslint-disable global-require */
  require('dotenv').config();
  /* eslint-enable global-require */
} catch (e) {
  info('Parsing ENV files failed!');
  info(e);
}


const DEV = argv.dev || argv.env === 'dev' || process.env.NODE_ENV === 'development';
const DOMAIN = argv.h || argv.host || process.env.DOMAIN || process.env.HOST || 'localhost';
const PORT = argv.p || argv.port || process.env.PORT || 3000;

const Provider = require('oidc-provider');
// const SuperAdapter = require('../../lib/db/adapter/mongoAdapter');
const SuperAdapter = require('../../lib/db');
// const SuperAdapter = require('../../lib/db/setup/adapter');

const { AdapterTest } = Provider;

const provider = new Provider(`${DEV ? 'http://' : 'https://'}${DOMAIN}${DEV ? (`:${PORT}`) : ''}`);
const test = new AdapterTest(provider);

provider.initialize({ adapter: SuperAdapter })
  .then(() => test.execute())
  .then(() => {
    console.log('tests passed');
    process.exit();
  })
  .catch((err) => {
    console.dir(err);
    process.exit(1);
  });
