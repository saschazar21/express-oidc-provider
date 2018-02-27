#!/usr/bin/env node
const info = require('debug')('info');

try {
  /* eslint-disable global-require */
  require('dotenv').config();
  /* eslint-enable global-require */
} catch (e) {
  info('Parsing ENV files failed!');
  info(e);
}

const Enquirer = require('enquirer');
const password = require('prompt-password');

const uuid = require('../lib/tools/uuid');
const { user } = require('./partials/user');
const User = require('../lib/db/models/users');

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

const initialEnquirer = userEnquirer;

initialEnquirer.ask(userQuestions)
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
  .then(results => new User(results).save())
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
