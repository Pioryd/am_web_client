class SendPacket {
  static _send(client, packet_id, data) {
    if (client == null) return;

    if (packet_id !== "accept_connection" && client.ext.logged_in !== true)
      return;

    client.send(packet_id, data);
  }

  // Send

  static login(client, { login, password }) {
    this._send(client, "accept_connection", { login, password });
  }

  static module_data(client) {
    this._send(client, "module_data");
  }

  static process_script(client, { script }) {
    this._send(client, "process_script", {
      script
    });
  }

  static scripts_list(client) {
    this._send(client, "scripts_list", {});
  }

  static get_am_data(client, data) {
    this._send(client, "get_am_data", data);
  }

  static update_am_data(client, data) {
    this._send(client, "update_am_data", data);
  }
}

export default SendPacket;
