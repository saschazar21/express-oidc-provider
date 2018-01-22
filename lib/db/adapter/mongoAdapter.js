/* eslint global-require: 0 */
const error = require('debug')('error');
const info = require('debug')('info');
const uuid = require('uuid');

const idFactory = require('../../tools/uuid');

const models = {
  accesstoken: require('../models/accessTokens'),
  authorizationcode: require('../models/authorizationCodes'),
  refreshtoken: require('../models/refreshTokens'),
  clientcredentials: require('../models/clientCredentials'),
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
    const expiresAt = expiresIn ? new Date(Date.now() + (expiresIn * 1000)) : null;
    let data;
    let header;
    let identifier = id || idFactory(48, false);
    if (!id && this.name === 'client') {
      const uri = Array.isArray(payload.redirect_uris) ? payload.redirect_uris[0] : payload.redirect_uris;
      identifier = uuid.v5(uri, uuid.v5.URL);
    }

    try {
      data = JSON.parse(Buffer.from(payload.payload, 'base64').toString('utf8'));
      header = JSON.parse(Buffer.from(payload.header, 'base64').toString('utf8'));
    } catch (e) {
      error('Decoding payload failed!');
      error(payload);
      error(e);
    }

    info(`upsert ${this.name} - ${identifier}`);

    const entry = Object.assign(payload, {
      payload: data || payload.payload,
    }, {
      header: header || payload.header,
    }, expiresAt);

    info(entry);

    const result = await this.model.findOneAndUpdate({ _id: identifier }, { $set: entry }, {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true,
    });

    info(result);
    return result;
  }

  async find(id) {
    const result = await this.model.findById(id);
    info(`Result for find ${id}`);
    info(result);

    if (!result) {
      return null;
    }
    const res = result.toJSON();
    const header = Buffer.from(JSON.stringify(result.header)).toString('base64');
    const payload = Buffer.from(JSON.stringify(result.payload)).toString('base64');
    return { ...res, header, payload };
  }

  async consume(id) {
    const consumed = { consumed: new Date(Date.now()) };
    const result = await this.model.findOneAndUpdate({ _id: id }, { $set: consumed }, { new: true });
    info(`Result for consume ${id}`);
    info(result);
    return result;
  }

  async destroy(id) {
    const result = await this.model.deleteOne({ _id: id });
    info(`Result for destroy ${id}`);
    info(result);
    return result;
  }
}

module.exports = MongoAdapter;
