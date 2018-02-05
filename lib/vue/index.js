const { Nuxt, Builder } = require('nuxt');

const { isDev } = require('../tools/validators');
const n = require('../../nuxt.config');

const config = {
  ...n,
  dev: isDev,
};

const nuxt = new Nuxt(config);

if (isDev) {
  const builder = new Builder(nuxt);
  builder.build();
}

module.exports = nuxt;
