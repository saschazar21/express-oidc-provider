#!/usr/bin/env node
const User = require('../lib/db/models/users');

const firstBorn = {
  preferred_username: process.env.PREFERRED_USERNAME || 'test',
  email: process.env.EMAIL || 'test@abc.com',
  password: process.env.PASSWORD || 'test123',
  given_name: process.env.GIVEN_NAME || 'Testy',
  family_name: process.env.FAMILY_NAME || 'McTestface',
};

User.find()
  .then((users) => {
    if (users.length) {
      console.error(`DB already contains user: ${users[0].email}`);
      return users;
    }
    return new User(firstBorn).save();
  })
  .then(() => process.exit(0));
