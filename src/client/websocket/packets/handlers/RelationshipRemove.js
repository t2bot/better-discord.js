const AbstractHandler = require('./AbstractHandler');

class RelationshipRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.RelationshipRemove.handle(data);
  }
}

module.exports = RelationshipRemoveHandler;
