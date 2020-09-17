import React from "react";
import useConnectionManager from "../hooks/connection_manager";

export const ConnectionContext = React.createContext();

const ConnectionProvider = ({ parse_packet_hook, settings, children }) => {
  const {
    hook_parse_root_packet,
    hook_packets_data,
    hook_packets_fn,
    hook_ref_client
  } = parse_packet_hook();

  const {
    hook_connection_manager_fn,
    hook_connection_info,
    hook_client
  } = useConnectionManager({
    settings: settings,
    parse_root_packet: hook_parse_root_packet,
    on_connected: (client, data) =>
      hook_packets_fn.send("accept_connection", data)
  });

  const parse_packet = () => {
    const packets = hook_packets_fn.pop("accept_connection");
    if (packets.length === 0) return;

    hook_connection_manager_fn.set_logged_as(
      settings.accept_connection_data.login
    );
  };

  const set_client = (client) => {
    hook_ref_client.current = client;
  };

  React.useEffect(() => set_client(hook_client), [hook_client]);
  React.useEffect(() => parse_packet(), [hook_packets_data]);

  const value = {
    context_connection_packets_data: hook_packets_data,
    context_connection_info: hook_connection_info,
    context_connection_client: hook_client,
    context_connection_fn: {
      send: (packet_id, packet_data) =>
        hook_packets_fn.send(packet_id, packet_data),
      ...hook_packets_fn,
      set_enabled: hook_connection_manager_fn.set_connection_enabled
    }
  };
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
