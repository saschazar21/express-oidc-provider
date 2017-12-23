// module.exports = [{
// token_endpoint_auth_method: 'none',
// client_id: 'test',
// grant_types: ['refresh_token', 'authorization_code'],
// response_types: ['id_token'],
// redirect_uris: ['http://localhost:3001/cb'],
// }];

const { isDev } = require('../../tools/validators');

if (!isDev) {
  throw new Error('Dummy client is included, but app is not in DEV mode!');
}

module.exports = [
  // reconfigured the foo client for the purpose of showing the adapter working
  {
    client_id: '2a4cebb6-9042-4d5d-aa6f-d15a49b01e6f',
    client_secret: '448ba377e5a2fec6126fd8579c83beb184abb77f1d34be3397be1e9d83e8d7dc',
    redirect_uris: ['https://home.dev:3001/callback'],
    response_types: ['code'],
    grant_types: ['authorization_code'],
    token_endpoint_auth_method: 'none',
  },
];
