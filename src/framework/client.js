/**
 * @description Handling sockets and connections.
 */
import io from "socket.io-client";

export default class Client {
  constructor(url, on_parse_dict) {
    this.on_parse_dict = on_parse_dict;
    this.url = url;

    this.socket = {};
    // Time between send packets
    this.sync_interval = 2000;
  }

  /**
   * @description After call connect() socket need some time to change status
   *  to connected.
   */
  is_connected() {
    return this.socket.connected === true;
  }

  send(packet_id, data) {
    if (Object.entries(this.socket).length !== 0)
      this.socket.emit(packet_id, data);
  }

  connect() {
    this.socket = io(this.url);

    for (const [packet_id] of Object.entries(this.on_parse_dict)) {
      this.socket.on(packet_id, data => {
        try {
          if (packet_id in this.on_parse_dict) {
            let response = this.on_parse_dict[packet_id](data);
            if (response !== null && response !== undefined)
              setTimeout(() => {
                this.send(packet_id, response);
              }, this.sync_interval);
          }
        } catch (error) {
          console.log("Exception: " + error + error.stack);
        }
      });
    }
  }

  disconnect() {
    if (Object.entries(this.socket).length !== 0) {
      this.socket.close();
      this.socket = {};
    }
  }
}
