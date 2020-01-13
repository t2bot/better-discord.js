const Action = require('./Action');
const Constants = require('../../util/Constants');

class RelationshipRemoveAction extends Action {
  handle(data) {
    const client = this.client;
    const user = client.user;

    const relationship = user.relationships.get(data.id);

    if (user.relationships.has(data.id)) user.relationships.delete(data.id);
    if (user.friends.has(data.id)) user.friends.delete(data.id);
    if (user.blocked.has(data.id)) user.blocked.delete(data.id);
    if (user.incomingFriendRequests.has(data.id)) user.incomingFriendRequests.delete(data.id);
    if (user.outgoingFriendRequests.has(data.id)) user.outgoingFriendRequests.delete(data.id);

    client.emit(Constants.Events.RELATIONSHIP_REMOVE, relationship);
  }
}

module.exports = RelationshipRemoveAction;
