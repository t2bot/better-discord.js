const AbstractHandler = require('./AbstractHandler');

class RelationshipAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.RelationshipAdd.handle(data);
  }
}

module.exports = RelationshipAddHandler;
