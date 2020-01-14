class SendPacket {
  static _send(client, packet_id, data) {
    if (client != null) client.send(packet_id, data);
  }

  static login(client, { login, password }) {
    this._send(client, "accept_connection", { login, password });
  }

  static data_full(client) {
    this._send(client, "data_full");
  }

  static data_character(client) {
    this._send(client, "data_character");
  }

  static data_land(client) {
    this._send(client, "data_land");
  }

  static data_world(client) {
    this._send(client, "data_world");
  }

  static data_character_change_position(client, { position_x }) {
    this._send(client, "data_character_change_position", {
      position_x
    });
  }

  static data_character_change_land(client, { land_id }) {
    this._send(client, "data_character_change_land", { land_id });
  }

  static data_character_add_friend(client, { name }) {
    this._send(client, "data_character_add_friend", { name });
  }

  static data_character_remove_friend(client, { name }) {
    this._send(client, "data_character_remove_friend", { name });
  }

  static data_character_change_state(client, { name }) {
    this._send(client, "data_character_change_state", { name });
  }

  static data_character_change_action(client, { name }) {
    this._send(client, "data_character_change_action", { name });
  }

  static data_character_change_activity(client, { name }) {
    this._send(client, "data_character_change_activity", { name });
  }

  static action_message(client, { name, text }) {
    this._send(client, "action_message", { name, text });
  }

  // Currently is not used by server
  static enter_virtual_world(client, { id }) {
    this._send(client, "enter_virtual_world", { id });
  }

  static leave_virtual_world(client) {
    this._send(client, "leave_virtual_world", {});
  }

  static virtual_world(client, { id, packet_id, packet_data }) {
    this._send(client, "virtual_world", { id, packet_id, packet_data });
  }

  static process_script_action(client, { object_id, action_id, dynamic_args }) {
    this._send(client, "process_script_action", {
      object_id,
      action_id,
      dynamic_args
    });
  }
}

export default SendPacket;
