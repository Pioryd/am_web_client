class SendPacket {
  static _send(state_client, packet_id, data) {
    if (state_client != null) state_client.send(packet_id, data);
  }

  static login(state_client, login, password) {
    this._send(state_client, "login", { login: login, password: password });
  }

  static update(state_client) {
    this._send(state_client, "update");
  }

  static change_position(state_client, character_id, position) {
    this._send(state_client, "change_position", {
      character_id: character_id,
      position: position
    });
  }

  static change_land(state_client, character_id, land_id) {
    this._send(state_client, "change_land", {
      character_id: character_id,
      land_id: land_id
    });
  }

  static add_friend(state_client, character_id, friend_name) {
    this._send(state_client, "add_friend", {
      character_id: character_id,
      friend_name: friend_name
    });
  }

  static send_message(
    state_client,
    from_character_id,
    to_character_id,
    message
  ) {
    this._send(state_client, "chat_message", {
      from_character_id: from_character_id,
      to_character_id: to_character_id,
      message: message
    });
  }
}

export default SendPacket;
