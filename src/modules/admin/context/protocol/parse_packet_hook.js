import React from "react";

function useParsePacketHook(props) {
  const ref_client = React.useRef();
  const [state_logged_as, set_state_logged_as] = React.useState("");
  const [state_packets_data, set_state_packets_data] = React.useState({});

  const get_client = () => {
    return ref_client.current;
  };

  const send = (packet_id, data) => {
    if (get_client() == null) return;

    if (
      packet_id !== "accept_connection" &&
      get_client().ext.logged_in !== true
    )
      return;

    get_client().send(packet_id, data);
  };

  const packets_pop = packet_id => {
    const packets_data = { ...state_packets_data };

    if (!(packet_id in packets_data)) return [];
    if (packets_data[packet_id].length === 0) return [];

    const packet_data_list = packets_data[packet_id];
    packets_data[packet_id] = [];

    set_state_packets_data(packets_data);

    return packet_data_list;
  };

  const packets_peek = packet_id => {
    const packets_data = { ...state_packets_data };

    if (!(packet_id in packets_data)) return [];
    if (packets_data[packet_id].length === 0) return [];

    const packet_data_list = packets_data[packet_id];

    return JSON.parse(JSON.stringify(packet_data_list));
  };

  const _push_packet_data = (packet_id, data) => {
    const packets_data = { ...state_packets_data };

    if (!(packet_id in packets_data)) packets_data[packet_id] = [];

    while (packets_data[packet_id].length >= 10)
      packets_data[packet_id].shift();

    packets_data[packet_id].push(data);

    set_state_packets_data(packets_data);
  };

  return {
    hook_parse_packet: {
      login: data => {
        get_client().ext.logged_in = true;
        set_state_logged_as(data.character_name);
        send("scripts_list", {});
      },
      module_data: data => {
        _push_packet_data("module_data", data);
      },
      scripts_list: data => {
        _push_packet_data("scripts_list", data);
      }
    },
    hook_logged_as: state_logged_as,
    hook_packets_data: state_packets_data,
    hook_packets_fn: { pop: packets_pop, peek: packets_peek },
    hook_ref_client: ref_client
  };
}

export default useParsePacketHook;
