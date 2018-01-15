/*
 * - grantId {string} the original id assigned to a grant (authorization request)
 * - header {string} oidc-provider tokens are themselves JWTs, this is the header part of the token
 * - payload {string} second part of the token
 * - signature {string} the signature of the token
 */
const AccessToken = require('./accessTokens');
const mongoose = require('../setup');

const options = { discriminatorKey: 'kind' };

const registrationAccessTokenSchema = new mongoose.Schema({}, options);

const RegistrationAccessToken = AccessToken.discriminator('RegistrationAccessToken', registrationAccessTokenSchema);

module.exports = RegistrationAccessToken;
