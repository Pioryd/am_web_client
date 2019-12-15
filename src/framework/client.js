/**
 * @description Handling sockets and connections.
 */
import io from "socket.io-client";

export default class Client {
  constructor({ url = "", check_interval = 1000 }) {
    this.url = url;
    this.check_interval = check_interval;

    this.parse_packet_dict = {};
    this.socket = undefined;
  }

  send(packet_id, data) {
    if (this.socket !== undefined && this.is_connected())
      this.socket.emit(packet_id, data);
  }

  add_parse_packet_dict(parse_packet_dict) {
    this.parse_packet_dict = {
      ...this.parse_packet_dict,
      ...parse_packet_dict
    };
  }

  /**
   * @description After call connect() socket need some time to change status
   *  to connected.
   */
  is_connected() {
    return this.socket !== undefined && this.socket.connected;
  }

  connect() {
    this.socket = io(this.url);

    for (const [packet_id] of Object.entries(this.parse_packet_dict)) {
      this.socket.on(packet_id, data => {
        try {
          // Parse packet
          if (!(packet_id in this.parse_packet_dict)) {
            console.log("Unable to parse packet id: " + packet_id);
            return;
          }
          let send_packet = this.parse_packet_dict[packet_id](data);
          if (send_packet !== undefined && send_packet !== null) {
            if (send_packet.delay !== undefined) {
              setTimeout(() => {
                this.send(send_packet.id, send_packet.data);
              }, send_packet.delay);
            } else this.send(send_packet.id, send_packet.data);
          }
        } catch (error) {
          console.log("Exception: " + error + error.stack);
        }
      });
    }
  }

  disconnect() {
    if (this.is_connected()) this.socket.close();

    this.socket = {};
  }
}
