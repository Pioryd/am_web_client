class SendPacket {
  static update(state_client) {
    state_client.send("world", { command: "update" });
  }

  static change_position(state_client, position) {
    state_client.send("world", {
      command: "change_position",
      position: position
    });
  }

  static change_land(state_client, character_id, land_id) {
    state_client.send("world", {
      command: "change_land",
      character_id: character_id,
      land_id: land_id
    });
  }
}

export default SendPacket;
