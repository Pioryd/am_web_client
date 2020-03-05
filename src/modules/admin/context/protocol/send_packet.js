function send_packet(client, packet_id, data) {
  if (client == null) return;

  if (packet_id !== "accept_connection" && client.ext.logged_in !== true)
    return;

  client.send(packet_id, data);
}

export default send_packet;
