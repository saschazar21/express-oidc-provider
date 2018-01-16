/**
 * Client model
 * {
    token_endpoint_auth_method: 'none',
    client_id: 'mywebsite',
    grant_types: ['implicit'],
    response_types: ['id_token'],
    redirect_uris: ['https://client.example.com/cb'],
  },
 */
const cat = require('../../tools/cat');
const mongoose = require('../setup');
const url = require('url');
const validators = require('../../tools/validators');

const clientSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  redirect_uris: {
    lowercase: true,
    type: [String],
    validate: {
      validator: function validateURI(value) {
        const sane = value.filter((v) => {
          const u = url.parse(v);
          if (!this.application_type || this.application_type === 'web') {
            return validators.isUrl(v) && u.hostname !== 'localhost';
          }
          return (u.protocol !== 'http:' && u.protocol !== 'https:') || u.hostname === 'localhost';
        });
        return sane.length === value.length;
      },
      message: 'One of the given URIs either contains localhost and was declared as "web", or vice versa',
    },
    required: true,
  },
  response_types: {
    lowercase: true,
    type: [String],
    validate: {
      validator: function validResponseType(value) {
        const sane = value.filter(v => validators.validResponseType(v));
        return sane.length === value.length;
      },
      message: 'One of the given response types is not one of the following: code, id_token, token',
    },
  },
  grant_types: {
    type: [String],
    validate: {
      validator: function validGrantType(value) {
        const sane = value.filter(v => validators.validGrantType(v));
        return sane.length === value.length;
      },
      message: 'One of the given grant types is not one of the following: authorization_code, implicit, refresh_token',
    },
  },
  application_type: {
    default: 'web',
    lowercase: true,
    type: String,
    validate: {
      validator: val => val.toLowerCase() === 'web' || val.toLowerCase() === 'native',
      message: '{VALUE} not allowed, must be one of "web" or "native"',
    },
  },
  contacts: {
    lowercase: true,
    type: [String],
    validate: {
      validator: function checkEmail(value) {
        const sane = value.filter(v => validators.isEmail(v));
        return sane.length === value.length;
      },
      message: '{VALUE} is not a valid e-mail address.',
    },
  },
  client_name: String,
  logo_uri: {
    lowercase: true,
    default: async function getCats() {
      const catUrl = await cat();
      return catUrl;
    },
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
    },
  },
  client_uri: {
    lowercase: true,
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
    },
  },
  policy_uri: {
    lowercase: true,
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
    },
  },
  tos_uri: {
    lowercase: true,
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
    },
  },
  jwks_uri: {
    lowercase: true,
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
    },
  },
  jwks: {
    lowercase: true,
    type: String,
    validate: {
      validator: function checkJwksUri() {
        return !!this.jwks_uri;
      },
      message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
    },
  },
  sector_identifier_uri: {
    lowercase: true,
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
    },
  },
  subject_type: {
    lowercase: true,
    type: [String],
  },
  id_token_signed_response_alg: {
    default: 'RS256',
    type: String,
    validate: {
      validator: function checkAlg(value) {
        if (!validators.validJwsAlg(value)) {
          if (value.toLowerCase() === 'none') {
            return Array.isArray(this.grant_types) && this.grant_types.length === 1 && this.grant_types[0] === 'authorization_code';
          }
          return false;
        }
        return true;
      },
      message: '{VALUE} is not a valid signing algorithm, please check again',
    },
  },
  id_token_encrypted_response_alg: {
    required: function isResponseEnc() {
      return this.id_token_encrypted_response_enc;
    },
    type: String,
    validate: {
      validator: validators.validJweAlg,
      message: '{VALUE} is not a valid value for "alg", please check again',
    },
  },
  id_token_encrypted_response_enc: {
    required: function isResponseAlg() {
      return this.id_token_encrypted_response_alg;
    },
    type: String,
    validate: {
      validator: validators.validJweEnc,
      message: '{VALUE} is not a valid value for "enc", please check again',
    },
  },
  userinfo_signed_response_alg: {
    type: String,
    validate: {
      validator: validators.validJwsAlg,
      message: '{VALUE} is not a valid signing algorithm, please check again',
    },
  },
  userinfo_encrypted_response_alg: {
    required: function isResponseEnc() {
      return this.userinfo_encrypted_response_enc;
    },
    type: String,
    validate: {
      validator: validators.validJweAlg,
      message: '{VALUE} is not a valid value for "alg", please check again',
    },
  },
  userinfo_encrypted_response_enc: {
    required: function isResponseAlg() {
      return this.userinfo_encrypted_response_alg;
    },
    type: String,
    validate: {
      validator: validators.validJweEnc,
      message: '{VALUE} is not a valid value for "enc", please check again',
    },
  },
  request_object_signing_alg: {
    type: String,
    validate: {
      validator: function checkROAlg(value) {
        return validators.validJwsAlg(value) || value === 'none';
      },
      message: '{VALUE} is not a valid signing algorithm, please check again',
    },
  },
  request_object_encryption_alg: {
    required: function isResponseEnc() {
      return this.request_object_encryption_enc;
    },
    type: String,
    validate: {
      validator: validators.validJweAlg,
      message: '{VALUE} is not a valid value for "alg", please check again',
    },
  },
  request_object_encryption_enc: {
    required: function isResponseAlg() {
      return this.request_object_encryption_alg;
    },
    type: String,
    validate: {
      validator: validators.validJweEnc,
      message: '{VALUE} is not a valid value for "enc", please check again',
    },
  },
  token_endpoint_auth_method: {
    default: 'client_secret_basic',
    type: String,
    validate: {
      validator: function checkEndpointAuth(value) {
        return validators.endpointAuth(value) || value === 'none';
      },
      message: '{VALUE} is not a valid auth method, please check again',
    },
  },
  token_endpoint_auth_signing_alg: {
    type: String,
    validate: {
      validator: validators.validJwsAlg,
      message: '{VALUE} is not a valid signing algorithm, please check again',
    },
  },
  default_max_age: Number,
  require_auth_time: {
    default: false,
    type: Boolean,
  },
  default_acr_values: [String],
  initiate_login_uri: {
    lowercase: true,
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URI scheme starting with http(s)',
    },
  },
  request_uris: {
    lowercase: true,
    type: [String],
    validate: {
      validator: function validateURI(value) {
        const sane = value.filter(v => validators.isUrl(v));
        return sane.length === value.length;
      },
      message: 'One of the given URIs is not a valid URI starting with http(s)',
    },
  },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
