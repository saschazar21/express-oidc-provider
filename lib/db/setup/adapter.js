const error = require('debug')('error');
const info = require('debug')('info');
const { MongoClient } = require('mongodb'); // eslint-disable-line import/no-unresolved

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
    this.name = name.toLowerCase() + 's';
    info(`${this.name} initialized.`);
    collections.add(this.name);
  }

  coll(name) {
    return this.constructor.coll(name || this.name);
  }

  static coll(name) {
    return DB.collection(name);
  }

  async destroy(id) {
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

  async find(id) {
    const result = await this.coll().find({ _id: id }).limit(1).next();
    console.log(result);
    return result;
  }

  async upsert(_id, data, expiresIn) {
    let expiresAt;
    let payload;
    let header;

    if (expiresIn) {
      expiresAt = new Date(Date.now() + (expiresIn * 1000));
    }

    try {
      payload = JSON.parse(Buffer.from(data.payload, 'base64').toString('utf8'));
      header = JSON.parse(Buffer.from(data.header, 'base64').toString('utf8'));
    } catch (e) {
      error('Decoding payload failed!');
      error(data);
      error(e);
    }
    const document = Object.assign(data, payload ? { payload } : data.payload, header ? { header } : data.header, expiresAt && { expiresAt });

    return this.coll().updateOne({ _id }, document, { upsert: true });
  }

  static async connect() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const db = process.env.MONGO_DBNAME || '';
    const url = `mongodb://${host}:${port}/${db}`;
    const options = {
      auth: {
        user: process.env.MONGO_USER || null,
        password: process.env.MONGO_PASSWORD || null,
      },
    };
    info(`Trying to connect to: ${url} with user: ${options.auth.user}`);
    DB = await MongoClient.connect(url, options);
  }
}

module.exports = MongoAdapter;
