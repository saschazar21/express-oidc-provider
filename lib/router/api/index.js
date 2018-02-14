const { Router } = require('express');
const clients = require('./clients');
const passport = require('../../auth');
const refreshtokens = require('./refreshtokens');
const tokens = require('./tokens');
const users = require('./users');

const router = Router();

router.use(
  '/clients',
  passport.authenticate(['bearer'], { session: false }),
  clients,
);

router.use(
  '/refreshtokens',
  passport.authenticate(['bearer'], { session: false }),
  refreshtokens,
);

router.use(
  '/tokens',
  passport.authenticate(['bearer'], { session: false }),
  tokens,
);

router.use(
  '/users',
  passport.authenticate(['bearer'], { session: false }),
  users,
);

module.exports = router;
