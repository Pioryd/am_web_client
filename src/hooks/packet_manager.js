import React from "react";
import Util from "../framework/util";

function usePacketManagerHook({ settings }) {
  const ref_client = React.useRef();
  const [state_packets_data, set_state_packets_data] = React.useState({});

  const get_client = () => ref_client.current;

  const send = (packet_id, data) => {
    if (
      get_client() == null ||
      (packet_id !== "accept_connection" &&
        get_client().ext.connection_accepted !== true)
    )
      return;
    get_client().send(packet_id, data);
  };

  const pop = (packet_id) => {
    // Don't want change signal of state
    const packets_data = state_packets_data;

    if (!(packet_id in packets_data)) return [];
    if (packets_data[packet_id].length === 0) return [];

    const packet_data_list = packets_data[packet_id];
    packets_data[packet_id] = [];

    return packet_data_list;
  };

  const peek = (packet_id) => {
    const packets_data = { ...state_packets_data };

    if (!(packet_id in packets_data)) return [];
    if (packets_data[packet_id].length === 0) return [];

    const packet_data_list = packets_data[packet_id];

    return Util.shallow_copy(packet_data_list);
  };

  const _push = (packet_id, data) => {
    const packets_data = { ...state_packets_data };

    if (!(packet_id in packets_data)) packets_data[packet_id] = [];

    while (packets_data[packet_id].length >= settings.packet.queue_size)
      packets_data[packet_id].shift();

    packets_data[packet_id].push(data);

    set_state_packets_data(packets_data);
  };

  const accept_connection = (data) => {
    ref_client.current.ext.connection_accepted = true;
  };

  const parse_root = (data) => {
    const { packet_id, packet_data } = data;
    _push(packet_id, packet_data);

    if (packet_id === "accept_connection") accept_connection(packet_data);
  };

  return {
    hook_packet_manager_data: state_packets_data,
    hook_packet_manager_ref_client: ref_client,
    hook_packet_manager_fn: { pop, peek, send, _push, parse_root }
  };
}

export default usePacketManagerHook;
