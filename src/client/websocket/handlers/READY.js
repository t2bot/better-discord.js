'use strict';

let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.users.set(clientUser.id, clientUser);
  }

  for (const guild of data.guilds) {
    guild.shardID = shard.id;
    client.guilds.add(guild);
  }

  for (const privateChannel of data.private_channels) {
    client.channels.add(privateChannel);
  }

  for (const relationship of data.relationships) {
    client.user.relationships.add(relationship);
  }

  for (const presence of data.presences) {
    client.presences.add(presence);
  }

  shard.checkReady();
};
