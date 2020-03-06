import usePacketManagerHook from "./../../../../hooks/packet_manager";

function useParsePacketHook(props) {
  const {
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  } = usePacketManagerHook();

  return {
    hook_parse_packet: {
      accept_connection: data => {
        hook_packets_fn._push("accept_connection", data);

        hook_ref_client.current.ext.logged_in = true;

        hook_packets_fn.send("data_character", {});
        hook_packets_fn.send("data_land", {});
        hook_packets_fn.send("data_world", {});
      },
      data_character: data => {
        hook_packets_fn._push("data_character", data);
        hook_packets_fn.send("data_character", {});
      },
      data_land: data => {
        hook_packets_fn._push("data_land", data);
        hook_packets_fn.send("data_land", {});
      },
      data_world: data => {
        hook_packets_fn._push("data_world", data);
        hook_packets_fn.send("data_world", {});
      },
      action_message: data => {
        hook_packets_fn._push("action_message", data);
      },
      virtual_world: data => {
        hook_packets_fn._push("virtual_world", data);
      }
    },
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  };
}

export default useParsePacketHook;
