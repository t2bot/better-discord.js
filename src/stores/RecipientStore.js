'use strict';

const DataStore = require('./DataStore');
const User = require('../structures/User');

/**
 * Stores recipients of a group dm channels.
 * @extends {DataStore}
 */
class RecipientStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, User);
  }

  add(user) {
    const existing = this.get(user.id);
    if (existing) return existing;
    this.set(user.id, user);
    return user;
  }
}

module.exports = RecipientStore;
