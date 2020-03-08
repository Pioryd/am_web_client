import usePacketManagerHook from "../../../hooks/packet_manager";

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

        hook_packets_fn.send("scripts_list", {});
      },
      module_data: data => {
        hook_packets_fn._push("module_data", data);
      },
      scripts_list: data => {
        hook_packets_fn._push("scripts_list", data);
      },
      data_am_form: data => {
        hook_packets_fn._push("data_am_form", data);
      },
      update_am_form: data => {
        hook_packets_fn._push("update_am_form", data);
      }
    },
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  };
}

export default useParsePacketHook;
