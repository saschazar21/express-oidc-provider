const { client } = require('../../tools/redis');
const { isEmpty } = require('lodash');
const info = require('debug')('info');

const grantKeyFor = id => `grant:${id}`;

class RedisAdapter {
  constructor() {
    this.prefix = 'oidc:';
    info('Redis adapter initialized');
  }

  key(id) {
    const identifier = `${this.prefix}${id}`;
    info(`new identifier is: ${identifier}`);
    return identifier;
  }

  async destroy(id) {
    const key = this.key(id);
    const grantId = await client.hgetAsync(key, 'grantId');
    const tokens = await client.lrangeAsync(grantKeyFor(grantId), 0, -1);
    const deletions = tokens.map(token => client.delAsync(token));
    deletions.push(client.delAsync(key));

    const result = await deletions;
    info(`Session ${key} deleted from Redis`);
    return result;
  }

  async consume(id) {
    const result = await client.hsetAsync(this.key(id), 'consumed', Math.floor(Date.now() / 1000));
    info(`Session ${id} consumed`);
    return result;
  }

  async find(id) {
    const data = await client.hgetallAsync(this.key(id));
    info(`Session find: ${id})`);
    info(data);
    if (isEmpty(data)) {
      return false;
    } else if (data.dump !== undefined) {
      return JSON.parse(data.dump);
    }
  }

  async upsert(id, payload, expiresIn) {
    if (!payload || isEmpty(payload)) {
      return;
    }

    const key = this.key(id);
    const toStore = { dump: JSON.stringify(payload) };

    const multi = client.multi();
    multi.hmset(key, toStore);

    if (expiresIn) {
      info(expiresIn);
      multi.expire(key, expiresIn);
      info(`Session expires ${new Date(Date.now() + (expiresIn * 1000)).toLocaleString()}`);
    }

    if (toStore.grantId) {
      const grantKey = grantKeyFor(toStore.grantId);
      multi.rpush(grantKey, key);
    }

    const result = await multi.execAsync();
    info(`Session upsert: ${key})`);
    info(payload);
    info(result);
  }
}

module.exports = RedisAdapter;
