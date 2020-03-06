import React from "react";
import useClient from "../../../../hooks/client";
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
    hook_update_settings,
    hook_toggle_connection_enabled,
    hook_set_logged_as,
    hook_client,
    hook_connection_enabled,
    hook_connection_status,
    hook_connection_id
  } = useClient({
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
    hook_set_logged_as(packets.pop());
  }, [hook_packets_data]);

  React.useEffect(() => {
    hook_update_settings(settings);
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
    context_connection_toggle: hook_toggle_connection_enabled,
    context_connection_enabled: hook_connection_enabled,
    context_connection_status: hook_connection_status,
    context_connection_id: hook_connection_id
  };
  return (
    <ProtocolContext.Provider value={value}>
      {children}
    </ProtocolContext.Provider>
  );
};

export default ProtocolProvider;