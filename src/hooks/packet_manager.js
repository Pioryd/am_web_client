import React from "react";
import Util from "../framework/util";

const QUEUE_SIZE = 10;

function usePacketManagerHook(props) {
  const ref_client = React.useRef();
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

    while (packets_data[packet_id].length >= QUEUE_SIZE)
      packets_data[packet_id].shift();

    packets_data[packet_id].push(data);

    set_state_packets_data(packets_data);
  };

  return {
    hook_packets_data: state_packets_data,
    hook_packets_fn: { pop, peek, send, _push },
    hook_ref_client: ref_client
  };
}

export default usePacketManagerHook;
