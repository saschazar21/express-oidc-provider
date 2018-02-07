const nuxt = require('../../../lib/vue');

module.exports = async function renderError(ctx, error) {
  const err = {
    message: error.message || error.error_description || error,
    status: error.status || 400,
  };
  const e = await nuxt.renderRoute('error', { req: { error: err } });
  ctx.type = 'text/html';
  ctx.body = e.html;
};
