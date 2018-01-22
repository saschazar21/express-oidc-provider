/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const info = require('debug')('info');

const Client = require('../models/clients');
const uuid = require('../../tools/uuid');

class ClientAdapter {
  constructor() {
    this.model = Client;
  }

  async upsert(id, payload) {
    const password = uuid(24, false);
    let model = await this.model.findOne({ _id: id });
    if (!model) {
      const p = payload;
      p.password = p.password || password;
      model = this.model.create(p);
    }

    info(`Upsert ${id}`);
    info(model);
    return {
      ...model.toJSON(),
      password,
    };
  }

  async find(id) {
    const result = await this.model.findById(id);

    info(`Find ${id}`);
    info(result);
    return {
      ...result.toJSON(),
      client_id: result._id,
    };
  }

  async destroy(id) {
    return this.model.deleteOne({ _id: id });
  }
}

module.exports = ClientAdapter;
