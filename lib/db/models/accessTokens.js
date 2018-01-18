/*
 * - grantId {string} the original id assigned to a grant (authorization request)
 * - header {string} oidc-provider tokens are themselves JWTs, this is the header part of the token
 * - payload {string} second part of the token
 * - signature {string} the signature of the token
 * 
 * {
    "_id": "OTZkOTFmMmUtOTg3My00NzA4LTk0ZjYtNzY2MjIxZmFkZjk5",
    "header": "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0",
    "payload": "eyJhY2NvdW50SWQiOiJhc2RmIiwiY2xhaW1zIjp7fSwiY2xpZW50SWQiOiIyYTRjZWJiNi05MDQyLTRkNWQtYWE2Zi1kMTVhNDliMDFlNmYiLCJncmFudElkIjoiNmIwMmM2NTgtNzUyYS00NzI3LTlmNzQtMTcyNWVjNjE2NjBhIiwianRpIjoiT1Raa09URm1NbVV0T1RnM015MDBOekE0TFRrMFpqWXROelkyTWpJeFptRmtaams1Iiwia2luZCI6IkFjY2Vzc1Rva2VuIiwic2NvcGUiOiJvcGVuaWQiLCJpYXQiOjE1MTU2MDE1MTIsImV4cCI6MTUxNTYwNTExMiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0",
    "signature": "vxjDgQ-RG5NUGgo2TDj1qqgH0lpNzlUQ7L4VkiDzkugHSyRHVV4oFDiQWkCR9l2w7lVYHadsl14G4MuCUl9kpQ",
    "grantId": "6b02c658-752a-4727-9f74-1725ec61660a",
    "expiresAt": {
        "$date": "2018-01-10T17:25:12.614Z"
    }
}
 */
const mongoose = require('../setup');
const tokenModel = require('../abstract/token');

const options = { discriminatorKey: 'kind' };
const model = Object.assign(tokenModel, {
  createdAt: {
    default: Date.now,
    expires: 60 * 60 * 24,
    type: Date,
  },
});

const accessTokenSchema = new mongoose.Schema(model, options);

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);

module.exports = AccessToken;
