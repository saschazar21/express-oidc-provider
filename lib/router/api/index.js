const { Router } = require('express');

const clients = require('./clients');
const users = require('./users');

const router = Router();

router.use('/clients', clients);
router.use('/users', users);

module.exports = router;
