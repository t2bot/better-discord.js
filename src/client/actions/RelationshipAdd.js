'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class RelationshipAddAction extends Action {
  handle(data) {
    const client = this.client;

    let newRelationship = client.user.relationships.get(data.id);
    let oldRelationship = null;
    if (newRelationship) {
      oldRelationship = newRelationship._update(data);
    } else {
      newRelationship = client.user.relationships.add(data);
    }
    /**
     * Emitted whenever a relationship is updated
     * @event Client#relationshipAdd
     * @param {Relationship?} oldRelationship The relationship before the update
     * @param {Relationship} newRelationship The relationship after the update
     */
    client.emit(Events.RELATIONSHIP_ADD, oldRelationship, newRelationship);
    return {
      old: oldRelationship,
      updated: newRelationship,
    };
  }
}

module.exports = RelationshipAddAction;
