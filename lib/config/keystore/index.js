const fs = require('fs-extra');
const path = require('path');

const keystorePath = path.resolve(process.cwd(), process.env.KEYSTORE || './local/keystore.json');

module.exports = fs.readJsonSync(keystorePath);
