'use strict';

const Action = require('./Action');

class MessageUpdateAction extends Action {
  handle(data) {
    const channel = this.getChannel(data);
    if (channel) {
      const { id, channel_id, guild_id, author, timestamp, type } = data;
      console.log(
        '@@ Message Update called for ',
        JSON.stringify(
          {
            id,
            channel_id,
            guild_id,
            author,
            timestamp,
            type,
            manager: !!channel.messages,
          },
          null,
          2,
        ),
      );
      const message = this.getMessage({ id, channel_id, guild_id, author, timestamp, type }, channel);
      if (message) {
        message.patch(data);
        return {
          old: message._edits[0],
          updated: message,
        };
      }
    }

    return {};
  }
}

module.exports = MessageUpdateAction;
