'use strict';

const Base = require('./Base');

class Relationship extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The user this relationship affects
     * @type {User}
     */
    this.user = this.client.users.add(data.user);

    /**
     * The Unique ID of the relationship
     * @type {Snowflake}
     */
    this.id = data.id;

    this._patch(data);
  }

  /**
   * Sets up the relationship
   * @param {*} data The raw data of the relationship
   * @private
   */
  _patch(data) {
    /**
     * The type of the relationship, either:
     * * `friend` - a friend relationship
     * * `blocked` - a blocked relationship
     * * `incoming` - an incoming friend request relationship
     * * `outgoing` - an outgoing friend request relationship
     * * `unknown` - a generic or unknown relationship
     * @type {string}
     */
    if (typeof data.type === 'string') {
      this.type = data.type.toLowerCase();
    } else {
      this.type = ['unknown', 'friend', 'blocked', 'incoming', 'outgoing'][data.type] || 'unknown';
    }
  }
}

module.exports = Relationship;
