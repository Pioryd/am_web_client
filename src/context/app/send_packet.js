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
}

export default SendPacket;
