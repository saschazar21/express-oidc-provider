#!/usr/bin/env node
try {
  /* eslint-disable global-require */
  require('dotenv').config();
  /* eslint-enable global-require */
} catch (e) {
  info('Parsing ENV files failed!');
  info(e);
}

const Enquirer = require('enquirer');
const { argv } = require('yargs');
const password = require('prompt-password');

const uuid = require('../lib/tools/uuid');
const { client } = require('./partials/client');
const { user } = require('./partials/user');
const Client = require('../lib/db/models/clients');
const User = require('../lib/db/models/users');

const clientOnly = argv.c || argv['client-only'];
const userOnly = argv.u || argv['user-only'];

if (clientOnly && userOnly) {
  console.error('You may only reduce user/client creation to EITHER user OR client!\nPlease append EITHER --user-only OR --client-only!\n\nAborting...');
  process.exit(1);
}

const userEnquirer = new Enquirer();
userEnquirer.register('password', password);
const userQuestions = [];
Object.keys(user).forEach((key) => {
  const obj = {
    name: key,
    message: user[key],
    type: key === 'password' ? 'password' : 'input',
  };
  userQuestions.push(obj);

  if (obj.name === 'password' || obj.name === 'email') {
    const copy = { ...obj, name: `${obj.name}_confirm`, message: `(again) ${obj.message}` };
    userQuestions.push(copy);
  }
});

const clientEnquirer = new Enquirer();
const clientQuestions = [];
Object.keys(client).forEach((key) => {
  const obj = {
    name: key,
    message: client[key],
  };
  clientQuestions.push(obj);

  if (obj.name === 'password' || obj.name === 'email') {
    const copy = { ...obj, name: `${obj.name}_confirm`, message: `(again) ${obj.message}` };
    clientQuestions.push(copy);
  }
});

const initialEnquirer = clientOnly ? clientEnquirer : userEnquirer;

initialEnquirer.ask(clientOnly ? clientQuestions : userQuestions)
  .then((obj) => {
    const results = obj;
    Object.keys(results).forEach((key) => {
      if (!key.endsWith('_confirm')) {
        return true;
      }
      const sanitized = key.replace('_confirm', '');
      if (results[key] === results[sanitized]) {
        return false;
      }
      throw new Error(`${sanitized} contains different entries for both inputs!`);
    });
    results.password = results.password || uuid(42);
    console.log(results.password);
    return results;
  })
  .then(results => clientOnly ? new Client(results).save() : new User(results).save())
  .then(console.log)
  .then(() => {
    if (clientOnly || userOnly) {
      return process.exit(0);
    }
    return null;
  })
  .then(() => clientEnquirer.ask(clientQuestions))
  .then((obj) => {
    const results = obj;
    Object.keys(results).forEach((key) => {
      if (!key.endsWith('_confirm')) {
        return true;
      }
      const sanitized = key.replace('_confirm', '');
      if (results[key] === results[sanitized]) {
        return false;
      }
      throw new Error(`${sanitized} contains different entries for both inputs!`);
    });
    return results;
  })
  .then(results => new Client(results).save())
  .then(console.log)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
