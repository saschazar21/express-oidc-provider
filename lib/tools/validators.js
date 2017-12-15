const isEmail = value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

const isUrl = value => /^https?:\/\//i.test(value);

const validGrantType = value => ['authorization_code', 'implicit', 'refresh_token'].indexOf(value.toLowerCase()) > -1;

const validJwa = value => ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'].indexOf(value.toUpperCase()) > -1;

const validResponseType = value => ['code', 'token', 'id_token'].indexOf(value.toLowerCase()) > -1;

module.exports = {
  isEmail,
  isUrl,
  validGrantType,
  validJwa,
  validResponseType,
};
