'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class RelationshipAddAction extends Action {
  handle(data) {
    const client = this.client;

    let newRelationship = client.relationships.get(data.id);
    let oldRelationship = null;
    if (newRelationship) {
      oldRelationship = newRelationship._update(data);
    } else {
      newRelationship = client.relationships.add(data);
    }
    if (!oldRelationship) {
      /**
       * Emitted whenever there is a new relationship
       * @event Client#relationshipAdd
       * @param {Relationship} relationship The added relationship
       */
      client.emit(Events.RELATIONSHIP_ADD, newRelationship);
      return {
        old: null,
        updated: newRelationship,
      };
    } else {
      /**
       * Emitted whenever a relationship is updated
       * @event Client#relationshipUpdate
       * @param {Relationship} oldRelationship The relationship before the update
       * @param {Relationship} newRelationship The relationship after the update
       */
      client.emit(Events.RELATIONSHIP_UPDATE, oldRelationship, newRelationship);
      return {
        old: oldRelationship,
        updated: newRelationship,
      };
    }
  }
}

module.exports = RelationshipAddAction;
