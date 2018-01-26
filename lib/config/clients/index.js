// module.exports = [{
// token_endpoint_auth_method: 'none',
// client_id: 'test',
// grant_types: ['refresh_token', 'authorization_code'],
// response_types: ['id_token'],
// redirect_uris: ['http://localhost:3001/cb'],
// }];
const uuidv5 = require('uuid/v5');

const { baseUrl } = require('../../tools/domain');
const random = require('../../tools/uuid');

const redirectUris = process.env.REDIRECT_URIS ? process.env.REDIRECT_URIS.split(',').map(u => u.trim()) : [];

module.exports = [
  {
    client_id: process.env.CLIENT_ID || uuidv5(baseUrl, uuidv5.DNS),
    client_secret: process.env.CLIENT_SECRET || random(64, true),
    redirect_uris: redirectUris.length ? redirectUris : ['http://localhost:3000/web/callback'],
    grant_types: ['authorization_code'],
    response_types: ['code'],
  },
];
