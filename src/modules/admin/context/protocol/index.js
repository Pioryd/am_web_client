import React from "react";
import useConnectionManager from "../../../../hooks/connection_manager";
import send_packet from "./send_packet";
import useParsePacketHook from "./parse_packet_hook";

export const ProtocolContext = React.createContext();

const ProtocolProvider = ({ settings, children }) => {
  const {
    hook_parse_packet,
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  } = useParsePacketHook();

  const {
    hook_connection_manager_fn,
    hook_client,
    hook_connection_info
  } = useConnectionManager({
    settings: settings,
    parse_packet_map: hook_parse_packet,
    on_connected: (client, data) => {
      send_packet(client, "accept_connection", data);
    }
  });

  React.useEffect(() => {
    hook_ref_client.current = hook_client;
  }, [hook_client]);

  React.useEffect(() => {
    const packets = hook_packets_fn.pop("accept_connection");
    if (packets.length === 0) return;
    hook_connection_manager_fn.set_logged_as(packets.pop());
  }, [hook_packets_data]);

  React.useEffect(() => {
    hook_connection_manager_fn.set_settings(settings);
  }, [settings]);

  const value = {
    context_packets_data: hook_packets_data,
    context_packets_fn: {
      send: (packet_id, packet_data) => {
        send_packet(hook_client, packet_id, packet_data);
      },
      ...hook_packets_fn
    },
    context_ref_client: hook_ref_client,

    // Each protocol context must have these
    context_connection_fn: {
      set_enabled: hook_connection_manager_fn.set_connection_enabled
    },
    context_connection_info: hook_connection_info
  };
  return (
    <ProtocolContext.Provider value={value}>
      {children}
    </ProtocolContext.Provider>
  );
};

export default ProtocolProvider;
