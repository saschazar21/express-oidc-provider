const Provider = require('oidc-provider');

const config = require('../config/config');
const domain = require('../tools/domain');
const { isDev } = require('../tools/validators');

const oidc = new Provider(`${isDev ? 'http://' : 'https://'}${domain.DOMAIN}${isDev ? (`:${domain.PORT}`) : ''}`, config);
module.exports = oidc;
