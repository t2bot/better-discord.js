'use strict';

const DataStore = require('./DataStore');
const Relationship = require('../structures/Relationship');
const UserStore = require('../stores/UserStore');

/**
 * Stores relationships
 * @extends {DataStore}
 */
class RelationshipStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Relationship);
  }

  /**
   * Get all users who are currently friends, mapped by their IDs
   * @type {UserStore<Snowflake, User>}
   * @readonly
   */
  get friends() {
    return this.getUsersByType('friend');
  }

  /**
   * Get all users who are currently blocked, mapped by their IDs
   * @type {UserStore<Snowflake, User>}
   * @readonly
   */
  get blocked() {
    return this.getUsersByType('blocked');
  }

  /**
   * Get all users from whom we have an incoming friends request, mapped by their IDs
   * @type {UserStore<Snowflake, User>}
   * @readonly
   */
  get incoming() {
    return this.getUsersByType('incoming');
  }

  /**
   * Get all users to whom we have an outgoing friends reuqest, mapped by their IDs
   * @type {UserStore<Snowflake, User>}
   * @readonly
   */
  get outgoing() {
    return this.getUsersByType('outgoing');
  }

  /**
   * Requests a relationship
   * @param {string} type The type of the relationship
   * @param {UserResolvable} userResolvable The users affected relationship
   * @returns {?User | string}
   */
  async request(type, userResolvable) {
    const user = this.client.users.resolve(userResolvable);
    if (!user && type !== 'friend') {
      return null;
    }
    // You can only set friend and blocked here
    const typeId = {
      friend: 1,
      blocked: 2,
    }[type];
    if (!typeId) {
      return null;
    }
    if (user) {
      const data = {};
      if (typeId !== 1) {
        data.type = typeId;
      }
      await this.client.api.users['@me'].relationships[user.id].put({ data });
      return user;
    } else if (typeof userResolvable === 'string' && userResolvable.includes('#')) {
      const parts = userResolvable.split('#');
      const data = {
        username: parts[0],
        discriminator: Number(parts[1]),
      };
      await this.client.api.users['@me'].relationships.post({ data });
      return userResolvable;
    }
    return null;
  }

  /**
   * Removes a relationship
   * @param {UserResolvable} userResolvable The users whos relationship to remove
   */
  async remove(userResolvable) {
    const user = this.users.resolve(userResolvable);
    if (!user) {
      return;
    }
    await this.client.api.users['@me'].relationships[user.id].delete();
  }

  /**
   * Get all users by a certain type
   * @param {string} type The type of the relationship
   * @readonly
   * @internal
   * @returns {UserStore<Snowflake, Users>}
   */
  getUsersByType(type) {
    const users = new UserStore(this.client);
    this.filter(rel => rel.type === type).map(rel => users.set(rel.user.id, rel.user));
    return users;
  }
}

module.exports = RelationshipStore;
