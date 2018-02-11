const { Router } = require('express');
const error = require('debug')('error');

const User = require('../../db/models/users');
const clients = require('./clients');
const users = require('./users');

const router = Router();

const findUser = async (req, res, next) => {
  const user = await User.findOne({ email: req.token.payload.accountId });
  if (!user) {
    error(`No user found: ${req.token.payload.accountId}`);
    return res.status(500).send('Internal Server Error');
  }
  req.user = user.toJSON();
  return next();
};

router.use(
  '/clients',
  findUser,
  clients,
);

router.use(
  '/users',
  findUser,
  users,
);

module.exports = router;
