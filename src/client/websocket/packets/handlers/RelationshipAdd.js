const AbstractHandler = require('./AbstractHandler');

class RelationshipAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    // remove the old relationships
    if (client.user.friends.has(data.id)) {
      client.user.friends.delete(data.id);
    }
    if (client.user.blocked.has(data.id)) {
      client.user.blocked.delete(data.id);
    }
    if (client.user.incomingFriendRequests.has(data.id)) {
      client.user.incomingFriendRequests.delete(data.id);
    }
    if (client.user.outgoingFriendRequests.has(data.id)) {
      client.user.outgoingFriendRequests.delete(data.id);
    }
    if (data.type === 1) { // friend
      client.fetchUser(data.id).then(user => {
        client.user.friends.set(user.id, user);
      });
    } else if (data.type === 2) { // blocked
      client.fetchUser(data.id).then(user => {
        client.user.blocked.set(user.id, user);
      });
    } else if (data.type === 3) { // incoming friend request
      client.fetchUser(data.id).then(user => {
        client.user.incomingFriendRequests.set(user.id, user);
      });
    } else if (data.type === 4) { // outgoing friend request
      client.fetchUser(data.id).then(user => {
        client.user.outgoingFriendRequests.set(user.id, user);
      });
    }
  }
}

module.exports = RelationshipAddHandler;
