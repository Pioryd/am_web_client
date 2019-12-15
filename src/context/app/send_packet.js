class SendPacket {
  static login(state_client) {
    state_client.send("login", { character_id: -1 });
  }

  static update(state_client) {
    state_client.send("update");
  }

  static change_position(state_client, character_id, position) {
    state_client.send("change_position", {
      character_id: character_id,
      het: "hello",
      position: position
    });
  }

  static change_land(state_client, character_id, land_id) {
    state_client.send("change_land", {
      character_id: character_id,
      land_id: land_id
    });
  }

  static add_friend(state_client, character_id, friend_name) {
    state_client.send("add_friend", {
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
    state_client.send("chat_message", {
      from_character_id: from_character_id,
      to_character_id: to_character_id,
      message: message
    });
  }
}

export default SendPacket;
