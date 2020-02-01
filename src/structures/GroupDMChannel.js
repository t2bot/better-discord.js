'use strict';

const Channel = require('./Channel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const MessageStore = require('../stores/MessageStore');
const RecipientStore = require('../stores/RecipientStore');

/**
 * Represents a group DM channel between multiple users.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class GroupDMChannel extends Channel {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the Group DM channel
   */
  constructor(client, data) {
    super(client, data);
    // Override the channel type so partials have a known type
    this.type = 'group';
    /**
     * A collection containing the messages sent to this channel
     * @type {MessageStore<Snowflake, Message>}
     */
    this.messages = new MessageStore(this);
    this._typing = new Map();

    /**
     * A collection of all participants of this group DM channel
     * @type {UserStore<Snowflake, User>}
     */
    if (!this.recipients) {
      this.recipients = new RecipientStore(client);
    }
  }

  _patch(data) {
    super._patch(data);

    /**
     * The name of the group dm channel
     * @type {?string}
     */
    this.name = data.name;

    /**
     * The hash of the group dm icon
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The ID of the application that created this group DM (if applicable)
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id;

    if (data.recipients) {
      if (this.recipients) {
        this.recipients.clear();
      } else {
        this.recipients = new RecipientStore(this.client);
      }
      for (const recipient of data.recipients) {
        this.client.users.add(recipient, this);
      }
    }

    if (data.owner_id) {
      /**
       * The user ID of this guild's owner
       * @type {Snowflake}
       */
      this.ownerID = data.owner_id;
    }

    /**
     * The ID of the last message in the channel, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = data.last_message_id;

    /**
     * The timestamp when the last pinned message was pinned, if there was one
     * @type {?number}
     */
    this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp).getTime() : null;
  }

  /**
   * The URL to this group dm's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size, dynamic } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.ChannelIcon(this.id, this.icon, format, size, dynamic);
  }

  /**
   * The owner of the guild
   * @type {?GuildMember}
   * @readonly
   */
  get owner() {
    return this.client.users.get(this.ownerID);
  }

  /**
   * Wheather this GroupDMChannel is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return typeof this.lastMessageID === 'undefined';
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  get lastMessage() {}
  get lastPinAt() {}
  send() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  // Doesn't work on DM channels; bulkDelete() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(GroupDMChannel, true, ['bulkDelete']);

module.exports = GroupDMChannel;
