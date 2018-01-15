/* eslint global-require: 0 */
const info = require('debug')('info');
const uuid = require('uuid');

const idFactory = require('../../tools/uuid');

const models = {
  accesstoken: require('../models/accessTokens'),
  authorizationcode: require('../models/authorizationCodes'),
  refreshtoken: require('../models/refreshTokens'),
  clientcredentials: require('../models/clientCredentials'),
  client: require('../models/clients'),
  initialaccesstoken: require('../models/initialAccessTokens'),
  registrationaccesstoken: require('../models/registrationAccessTokens'),
};

class MongoAdapter {
  constructor(name) {
    this.name = name.toLowerCase();
    this.model = models[this.name];

    if (!this.model) {
      throw new Error(`Model ${name} does not exist!`);
    }
    info(`${name} successfully initialized.`);
  }

  async upsert(id, payload, expiresIn) {
    /** TODO: Set expiry, base64 decode payload */
    let identifier = id || idFactory(48, false);
    if (!id && this.name === 'client') {
      const uri = Array.isArray(payload.redirect_uris) ? payload.redirect_uris[0] : payload.redirect_uris;
      identifier = uuid.v5(uri, uuid.v5.URL);
    }

    info(`upsert ${this.name} - ${identifier}`);
    info(payload);

    return this.model.findOneAndUpdate({ _id: identifier }, { $set: payload }, {
      new: true,
      upsert: true,
    });
  }
}

module.exports = MongoAdapter;
