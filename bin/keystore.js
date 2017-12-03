#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const { argv } = require('yargs');

const keystore = require('../lib/tools/keystore');

const filename = argv.file || argv.f || path.resolve(__dirname, '../local/keystore.json');
const basePath = path.dirname(filename);

console.log(`Trying to create a random keystore to ${basePath}`);
fs.pathExists(filename)
  .then((exists) => {
    if (!exists) {
      return false;
    }
    if (exists && argv.force) {
      return false;
    }
    throw new Error('File exists. To overwrite, you have to append the --force flag. Exiting...');
  })
  .then(() => fs.ensureDir(basePath))
  .then(() => keystore())
  .then(keys => fs.writeFile(filename, JSON.stringify(keys.toJSON(true), null, 2)))
  .then(() => console.log(`Successfully generated file ${filename}`))
  .catch(e => console.error(`An error occurred! ${e.message || e}`));
