'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class RelationshipRemoveAction extends Action {
  handle(data) {
    const client = this.client;

    const relationship = client.user.relationships.cache.get(data.id);
    if (!relationship) {
      return;
    }
    client.user.relationships.cache.delete(data.id);
    /**
     * Emitted whenever a relationship is removed
     * @event Client#relationshipRemove
     * @param {Relationship} relationship The removed relationship
     */
    client.emit(Events.RELATIONSHIP_REMOVE, relationship);
  }
}

module.exports = RelationshipRemoveAction;
