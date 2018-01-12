const MongoAdapter = require('./adapter/mongoAdapter');
const RedisAdapter = require('./adapter/redisAdapter');

/**
 * Super adapter for needed database models:
 * "Session", "AccessToken",
 * "AuthorizationCode", "RefreshToken", "ClientCredentials" or "Client", "InitialAccessToken",
 * "RegistrationAccessToken"
 */
class SuperAdapter {
/**
  *
  * Creates an instance of SuperAdapter for an oidc-provider model.
  *
  * @constructor
  * @param {string} name Name of the oidc-provider model. One of "Session", "AccessToken",
  * "AuthorizationCode", "RefreshToken", "ClientCredentials" or "Client", "InitialAccessToken",
  * "RegistrationAccessToken"
  *
  */
  constructor(name) {
    switch (name.toLowerCase()) {
      case 'session':
        this.adapter = new RedisAdapter();
        break;
      default:
        this.adapter = new MongoAdapter(name);
    }
  }

  /**
   *
   * Update or Create an instance of an oidc-provider model.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier that oidc-provider will use to reference this model instance for
   * future operations.
   * @param {object} payload Object with all properties intended for storage.
   * @param {expiresIn} integer Number of seconds intended for this model to be stored.
   *
   */
  async upsert(id, payload, expiresIn) {
    return this.adapter.upsert(id, payload, expiresIn);
  }

  /**
   *
   * Return previously stored instance of an oidc-provider model.
   *
   * @return {Promise} Promise fulfilled with either Object (when found and not dropped yet due to
   * expiration) or falsy value when not found anymore. Rejected with error when encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async find(id) {
    return this.adapter.find(id);
  }

  /**
   *
   * Mark a stored oidc-provider model as consumed (not yet expired though!). Future finds for this
   * id should be fulfilled with an object containing additional property named "consumed".
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async consume(id) {
    return this.adapter.consume(id);
  }

  /**
   *
   * Destroy/Drop/Remove a stored oidc-provider model and other grant related models. Future finds
   * for this id should be fulfilled with falsy values.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async destroy(id) {
  /**
   *
   * See upsert for the note on grantId, it's imperitive to destroy all tokens with the same
   * grantId when destroy is called. To query your persistancy store for the grantId of this token
   * and also trigger a chain of removals for all related tokens is recommended.
   *
   */
    return this.adapter.destroy(id);
  }
}

module.exports = SuperAdapter;
