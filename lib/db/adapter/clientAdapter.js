/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const error = require('debug')('error');
const info = require('debug')('info');

const Client = require('../models/clients');

class ClientAdapter {
  constructor() {
    this.model = Client;
  }

  async upsert(id, payload) {
    try {
      let model = await this.model.findOne({ _id: id });
      if (!model) {
        model = this.model.create(payload);
      }

      info(`Upsert ${id}`);
      info(model);
      return model;
    } catch (e) {
      error(e.message || e);
      return null;
    }
  }

  async find(id) {
    try {
      const result = await this.model.findById(id);

      info(`Find ${id}`);
      info(result);
      return {
        ...result.toJSON(),
        client_id: result._id,
      };
    } catch (e) {
      error(e.message || e);
      return null;
    }
  }

  async destroy(id) {
    try {
      return this.model.deleteOne({ _id: id });
    } catch (e) {
      error(e.message || e);
      return null;
    }
  }
}

module.exports = ClientAdapter;
