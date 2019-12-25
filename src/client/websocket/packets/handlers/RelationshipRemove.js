const AbstractHandler = require('./AbstractHandler');

class RelationshipRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (data.type === 1) { // friend
      if (client.user.friends.has(data.id)) {
        client.user.friends.delete(data.id);
      }
    } else if (data.type === 2) { // blocked
      if (client.user.blocked.has(data.id)) {
        client.user.blocked.delete(data.id);
      }
    } else if (data.type === 3) { // incoming friend request
      if (client.user.incomingFriendRequests.has(data.id)) {
        client.user.incomingFriendRequests.delete(data.id);
      }
    } else if (data.type === 4) { // outgoing friend request
      if (client.user.outgoingFriendRequests.has(data.id)) {
        client.user.outgoingFriendRequests.delete(data.id);
      }
    }
  }
}

module.exports = RelationshipRemoveHandler;
