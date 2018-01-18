/*
 * - grantId {string} the original id assigned to a grant (authorization request)
 * - header {string} oidc-provider tokens are themselves JWTs, this is the header part of the token
 * - payload {string} second part of the token
 * - signature {string} the signature of the token
 */
const mongoose = require('../setup');
const tokenModel = require('../abstract/token');

const refreshTokenSchema = new mongoose.Schema(tokenModel);

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;
