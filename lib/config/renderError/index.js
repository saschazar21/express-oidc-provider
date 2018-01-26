const fs = require('fs-extra');
const handlebars = require('handlebars');
const path = require('path');

const views = path.resolve(__dirname, '../../../views');

module.exports = async function renderError(ctx, error) {
  const header = await fs.readFile(path.resolve(views, './partials/header.hbs'));
  const footer = await fs.readFile(path.resolve(views, './partials/footer.hbs'));
  const seo = await fs.readFile(path.resolve(views, './partials/seo.hbs'));
  const errorTemplate = await fs.readFile(path.resolve(views, './error.hbs'));

  handlebars.registerPartial('header', header.toString('utf8'));
  handlebars.registerPartial('footer', footer.toString('utf8'));
  handlebars.registerPartial('seo', seo.toString('utf8'));

  const template = handlebars.compile(errorTemplate.toString('utf8'));

  ctx.type = 'html';
  ctx.body = template(error);
};
