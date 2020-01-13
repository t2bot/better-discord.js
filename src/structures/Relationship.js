/**
 * A relationship to another discord user
 * @param {Object} [data] Data to set in the relationship
 */
class Relationship {
  constructor(data = {}) {
    /**
     * The user of the relationship
     * @type {User}
     */
    this.user = data.user;

    /**
     * The type of the relationship, either:
     * * `friend` - a friend
     * * `blocked` - a blocked person
     * * `incomingFriend` - an incoming friends request
     * * `outgoingFriend` - an outgoing friends request
     * @type {string}
     */
    if (typeof data.type === "string") {
      this.type = data.type;
    } else {
      this.type = ["invalid", "friend", "blocked", "incomingFriend", "outgoingFriend"][data.type];
    }
  }
}

module.exports = Relationship;
