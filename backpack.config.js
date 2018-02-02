module.exports = {
  webpack: config => Object({
    ...config,
    entry: {
      main: './index.js',
    },
  }),
};
