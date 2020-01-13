const Action = require('./Action');
const Constants = require('../../util/Constants');
const Relationship = require('../../structures/Relationship');
const RelationshipTypes = Constants.RelationshipTypes;

class RelationshipAddAction extends Action {
  handle(data) {
    const client = this.client;
    const user = client.user;

    // remove the old relationships
    if (user.relationships.has(data.id)) user.relationships.delete(data.id);
    if (user.friends.has(data.id)) user.friends.delete(data.id);
    if (user.blocked.has(data.id)) user.blocked.delete(data.id);
    if (user.incomingFriendRequests.has(data.id)) user.incomingFriendRequests.delete(data.id);
    if (user.outgoingFriendRequests.has(data.id)) user.outgoingFriendRequests.delete(data.id);

    client.fetchUser(data.id).then(userObj => {
      const relationship = new Relationship({
        user: userObj,
        type: data.type,
      });
      user.relationships.set(userObj.id, relationship);
      switch (data.type) {
        case RelationshipTypes.FRIEND:
          user.friends.set(userObj.id, userObj);
          break;
        case RelationshipTypes.BLOCKED:
          user.blocked.set(userObj.id, userObj);
          break;
        case RelationshipTypes.INCOMING_FRIEND:
          user.incomingFriendRequests.set(userObj.id, userObj);
          break;
        case RelationshipTypes.OUTGOING_FRIEND:
          user.outgoingFriendRequests.set(userObj.id, userObj);
          break;
      }
      client.emit(Constants.Events.RELATIONSHIP_ADD, relationship);
    });
  }
}

module.exports = RelationshipAddAction;
