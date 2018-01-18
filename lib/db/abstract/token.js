/**
 * Token base model
 */

const mongoose = require('../setup');
const payload = require('./idToken');

module.exports = {
  _id: String,
  consumed: Date,
  expiresAt: {
    required: true,
    type: Date,
  },
  grantId: {
    required: true,
    type: String,
  },
  header: {
    required: true,
    type: mongoose.SchemaTypes.Mixed,
  },
  payload,
  signature: {
    required: true,
    type: String,
  },
};
