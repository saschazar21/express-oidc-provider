const { client } = require('../../tools/redis');
const { isEmpty } = require('lodash');
const info = require('debug')('info');

const grantKeyFor = id => `grant:${id}`;

class RedisAdapter {
  constructor() {
    this.prefix = 'oidc:';
  }

  key(id) {
    return `${this.prefix}${id}`;
  }

  async destroy(id) {
    const key = this.key(id);
    const grantId = await client.hgetAsync(key, 'grantId');
    const tokens = await client.lrangeAsync(grantKeyFor(grantId), 0, -1);
    const deletions = tokens.map(token => client.delAsync(token));
    deletions.push(client.delAsync(key));
    await deletions;
  }

  consume(id) {
    return client.hsetAsync(this.key(id), 'consumed', Math.floor(Date.now() / 1000));
  }

  async find(id) {
    const data = await client.hgetallAsync(this.key(id));
    if (isEmpty(data)) {
      return undefined;
    } else if (data.dump !== undefined) {
      return JSON.parse(data.dump);
    }

    info(`Session find: ${id})`);
    info(data);
    return data;
  }

  async upsert(id, payload, expiresIn) {
    const key = this.key(id);
    const toStore = { dump: JSON.stringify(payload) };

    const multi = client.multi();
    multi.hmset(key, toStore);

    if (expiresIn) {
      multi.expire(key, expiresIn);
    }

    if (toStore.grantId) {
      const grantKey = grantKeyFor(toStore.grantId);
      multi.rpush(grantKey, key);
    }

    const result = await multi.execAsync();
    info(`Session upsert: ${key})`);
    info(payload);
    info(result);
    return result;
  }
}

module.exports = RedisAdapter;
