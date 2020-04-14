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
        const { characters_info, am_data } = data;
        const character_id = Object.values(characters_info)[0].id;
        hook_ref_client.current.ext.logged_in = true;
        hook_ref_client.current.ext.character_id = character_id;

        hook_packets_fn.send("data_character", { character_id });
        hook_packets_fn.send("data_land", { character_id });
        hook_packets_fn.send("data_world", { character_id });
      },
      data_character: data => {
        hook_packets_fn._push("data_character", data);
        const { character_id } = hook_ref_client.current.ext;
        hook_packets_fn.send("data_character", { character_id });
      },
      data_land: data => {
        hook_packets_fn._push("data_land", data);
        const { character_id } = hook_ref_client.current.ext;
        hook_packets_fn.send("data_land", { character_id });
      },
      data_world: data => {
        hook_packets_fn._push("data_world", data);
        const { character_id } = hook_ref_client.current.ext;
        hook_packets_fn.send("data_world", { character_id });
      },
      action_message: data => hook_packets_fn._push("action_message", data),
      virtual_world: data => hook_packets_fn._push("virtual_world", data)
    },
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  };
}

export default useParsePacketHook;
