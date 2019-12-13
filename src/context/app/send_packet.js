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

  static change_land(state_client, land_id) {
    state_client.send("world", {
      command: "change_land",
      id: land_id
    });
  }
}

export default SendPacket;
