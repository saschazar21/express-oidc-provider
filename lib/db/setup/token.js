/**
 * Token base model
 */

const mongoose = require('./index');

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
  payload: {
    accountId: {
      required: true,
      type: String, // CHANGEME: mongoose.SchemaTypes.ObjectId,
      // CHANGEME: ref: 'User',
    },
    claims: mongoose.SchemaTypes.Mixed,
    clientId: {
      required: true,
      type: String, // CHANGEME: mongoose.SchemaTypes.ObjectId,
      // CHANGEME: ref: 'Client',
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
