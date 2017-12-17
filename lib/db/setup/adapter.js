const error = require('debug')('error');
const { MongoClient } = require('mongodb'); // eslint-disable-line import/no-unresolved
const { snakeCase } = require('lodash');

let DB;

class CollectionSet extends Set {
  add(name) {
    const nu = this.has(name);
    super.add(name);
    if (!nu) {
      DB.collection(name).createIndexes([
        { key: { grantId: 1 } },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
      ]).catch(error);
    }
  }
}

const collections = new CollectionSet();

class MongoAdapter {
  constructor(name) {
    this.name = snakeCase(name);
    collections.add(this.name);
  }

  coll(name) {
    return this.constructor.coll(name || this.name);
  }

  static coll(name) {
    return DB.collection(name);
  }

  destroy(id) {
    return this.coll().findOneAndDelete({ _id: id })
      .then((found) => {
        if (found.value && found.value.grantId) {
          const promises = [];

          collections.forEach((name) => {
            promises.push(this.coll(name).deleteMany({ grantId: found.value.grantId }));
          });

          return Promise.all(promises);
        }
        return undefined;
      });
  }

  consume(id) {
    return this.coll().findOneAndUpdate({ _id: id }, { $currentDate: { consumed: true } });
  }

  find(id) {
    return this.coll().find({ _id: id }).limit(1).next();
  }

  upsert(_id, payload, expiresIn) {
    let expiresAt;

    if (expiresIn) {
      expiresAt = new Date(Date.now() + (expiresIn * 1000));
    }

    const document = Object.assign(payload, expiresAt && { expiresAt });

    return this.coll().updateOne({ _id }, document, { upsert: true });
  }

  static async connect() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const db = process.env.MONGO_DBNAME || '';
    const url = `${host}:${port}/${db}`;
    const options = {
      auth: {
        username: process.env.MONGO_USER || null,
        password: process.env.MONGO_PASSWORD || null,
      },
    };

    DB = await MongoClient.connect(url, options);
  }
}

module.exports = MongoAdapter;
