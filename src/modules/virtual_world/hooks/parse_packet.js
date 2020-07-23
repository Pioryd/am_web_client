import usePacketManagerHook from "../../../hooks/packet_manager";

function useParsePacketHook(props) {
  const {
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  } = usePacketManagerHook();

  const parse_packets = {
    accept_connection: (data) => {
      hook_packets_fn._push("accept_connection", data);

      hook_ref_client.current.ext.logged_in = true;

      hook_packets_fn.send("data_mirror", {});
    }
  };

  return {
    hook_parse_packet: {
      root: (data) => {
        const { packet_id, packet_data } = data;
        if (packet_id in parse_packets) parse_packets[packet_id](packet_data);
        else hook_packets_fn._push(packet_id, packet_data);
      }
    },
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  };
}

export default useParsePacketHook;
