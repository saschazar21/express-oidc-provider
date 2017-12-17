const endpointAuth = value => ['client_secret_post', 'client_secret_basic', 'client_secret_jwt', 'private_key_jwt'].indexOf(value.toLowerCase()) > -1;

const isEmail = value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

const isUrl = value => /^https?:\/\//i.test(value);

const validGrantType = value => ['authorization_code', 'implicit', 'refresh_token'].indexOf(value.toLowerCase()) > -1;

const validJweAlg = value => ['RSA1_5', 'RSA-OAEP', 'RSA-OAEP-256', 'A128KW', 'A192KW', 'A256KW', 'dir', 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW', 'A128GCMKW', 'A192GCMKW', 'A256GCMKW', 'PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'].indexOf(value) > -1;

const validJweEnc = value => ['A128CBC-HS256', 'A192CBC-HS384', 'A256CBC-HS512', 'A128GCM', 'A192GCM', 'A256GCM'].indexOf(value) > -1;

const validJwsAlg = value => ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'].indexOf(value.toUpperCase()) > -1;

const validResponseType = value => ['code', 'token', 'id_token'].indexOf(value.toLowerCase()) > -1;

module.exports = {
  endpointAuth,
  isEmail,
  isUrl,
  validGrantType,
  validJweAlg,
  validJweEnc,
  validJwsAlg,
  validResponseType,
};
