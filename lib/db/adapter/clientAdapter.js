/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const info = require('debug')('info');

const Client = require('../models/clients');
const uuid = require('../../tools/uuid');

class ClientAdapter {
  constructor() {
    this.model = Client;
  }

  async upsert(id, payload) {
    let model = await this.model.findOne({ _id: id });
    if (!model) {
      model = this.model.create(payload);
    }

    info(`Upsert ${id}`);
    info(model);
    return model;
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
