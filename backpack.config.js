const path = require('path');

module.exports = {
  webpack: (config, options, webpack) => {
    const c = Object.assign(config, {
      entry: {
        main: path.resolve(__dirname, './index.js'),
      },
    });
    return c;
  },
};
