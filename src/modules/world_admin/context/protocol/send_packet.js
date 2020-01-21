class SendPacket {
  static _send(client, packet_id, data) {
    if (client != null) client.send(packet_id, data);
  }

  // Send

  static login(client, { login, password }) {
    this._send(client, "accept_connection", { login, password });
  }

  static process_script(client, { script }) {
    this._send(client, "process_script", {
      script
    });
  }

  static scripts_list(client) {
    this._send(client, "scripts_list", {});
  }
}

export default SendPacket;
