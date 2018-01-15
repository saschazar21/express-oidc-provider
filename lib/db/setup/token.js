/**
 * Token base model
 */

const mongoose = require('./index');

module.exports = {
  consumed: {
    default: false,
    type: Boolean,
  },
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
  payload: {
    accountId: {
      required: true,
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    claims: mongoose.SchemaTypes.Mixed,
    clientId: {
      required: true,
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Client',
    },
    grantId: {
      required: true,
      type: String,
    },
    jti: {
      required: true,
      type: String,
    },
    kind: String,
    scope: {
      required: true,
      type: String,
    },
    iat: {
      required: true,
      type: Number,
    },
    exp: {
      required: true,
      type: Number,
    },
    iss: {
      required: true,
      type: String,
    },
  },
  signature: {
    required: true,
    type: String,
  },
};
