const error = require('debug')('error');
const got = require('got');

module.exports = async () => {
  try {
    const response = await got('https://random.cat/meow', {
      // json: true,
    });
    const res = JSON.parse(response.body);
    return res.file;
  } catch (e) {
    error(e);
    return null;
  }
};
