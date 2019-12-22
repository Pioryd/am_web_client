class SendPacket {
  static _send(state_client, packet_id, data) {
    if (state_client != null) state_client.send(packet_id, data);
  }

  static login(state_client, { login, password }) {
    this._send(state_client, "accept_connection", { login, password });
  }

  static data_full(state_client) {
    this._send(state_client, "data_full");
  }

  static data_character(state_client) {
    this._send(state_client, "data_character");
  }

  static data_world(state_client) {
    this._send(state_client, "data_world");
  }

  static data_character_change_position(state_client, { position_x }) {
    this._send(state_client, "data_character_change_position", {
      position_x
    });
  }

  static data_character_change_land(state_client, { land_id }) {
    this._send(state_client, "data_character_change_land", { land_id });
  }

  static data_character_add_friend(state_client, { name }) {
    this._send(state_client, "data_character_add_friend", { name });
  }

  static data_character_remove_friend(state_client, { name }) {
    this._send(state_client, "data_character_remove_friend", { name });
  }

  static data_character_change_state(state_client, { name }) {
    this._send(state_client, "data_character_change_state", { name });
  }

  static data_character_change_action(state_client, { name }) {
    this._send(state_client, "data_character_change_action", { name });
  }

  static data_character_change_activity(state_client, { name }) {
    this._send(state_client, "data_character_change_activity", { name });
  }

  static action_message(state_client, { name, text }) {
    this._send(state_client, "action_message", { name, text });
  }
}

export default SendPacket;
