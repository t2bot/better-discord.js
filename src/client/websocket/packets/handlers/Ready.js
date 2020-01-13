const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');
const RelationshipTypes = Constants.RelationshipTypes;
const ClientUser = require('../../../../structures/ClientUser');
const Relationship = require('../../../../structures/Relationship');

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.ws.heartbeat();

    data.user.user_settings = data.user_settings;
    data.user.user_guild_settings = data.user_guild_settings;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    if (!client.user.bot) {
      // not a bot, let's fake a user agent
      const ua = require('useragent-generator');
      client.rest.userAgentManager.setFull(ua.chrome("79.0.3945.117"));
    }
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) if (!client.guilds.has(guild.id)) client.dataManager.newGuild(guild);
    for (const privateDM of data.private_channels) client.dataManager.newChannel(privateDM);

    for (const relation of data.relationships) {
      const user = client.dataManager.newUser(relation.user);
      client.user.relationships.set(user.id, new Relationship({
        user: user,
        type: relation.type,
      }));
      switch (relation.type) {
        case RelationshipTypes.FRIEND:
          client.user.friends.set(user.id, user);
          break;
        case RelationshipTypes.BLOCKED:
          client.user.blocked.set(user.id, user);
          break;
        case RelationshipTypes.INCOMING_FRIEND:
          client.user.incomingFriendRequests.set(user.id, user);
          break;
        case RelationshipTypes.OUTGOING_FRIEND:
          client.user.outgoingFriendRequests.set(user.id, user);
          break;
      }
    }

    data.presences = data.presences || [];
    for (const presence of data.presences) {
      client.dataManager.newUser(presence.user);
      client._setPresence(presence.user.id, presence);
    }

    if (data.notes) {
      for (const user in data.notes) {
        let note = data.notes[user];
        if (!note.length) note = null;

        client.user.notes.set(user, note);
      }
    }

    if (!client.user.bot && client.options.sync) client.setInterval(client.syncGuilds.bind(client), 30000);

    if (!client.users.has('1')) {
      client.dataManager.newUser({
        id: '1',
        username: 'Clyde',
        discriminator: '0000',
        avatar: 'https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png',
        bot: true,
        status: 'online',
        game: null,
        verified: true,
      });
    }

    const t = client.setTimeout(() => {
      client.ws.connection.triggerReady();
    }, 1200 * data.guilds.length);

    client.setMaxListeners(data.guilds.length + 10);

    client.once('ready', () => {
      client.syncGuilds();
      client.setMaxListeners(10);
      client.clearTimeout(t);
    });

    const ws = this.packetManager.ws;

    ws.sessionID = data.session_id;
    ws._trace = data._trace;
    client.emit('debug', `READY ${ws._trace.join(' -> ')} ${ws.sessionID}`);
    ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
