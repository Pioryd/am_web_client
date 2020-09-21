import React from "react";
import useConnectionManagerHook from "../hooks/connection_manager";
import usePacketManagerHook from "../hooks/packet_manager";

export const ConnectionContext = React.createContext();

const ConnectionProvider = ({ settings, children }) => {
  const {
    hook_packet_manager_data,
    hook_packet_manager_ref_client,
    hook_packet_manager_fn
  } = usePacketManagerHook(settings);

  const {
    hook_connection_manager_info,
    hook_connection_manager_client,
    hook_connection_manager_fn
  } = useConnectionManagerHook({
    settings: settings,
    parse_root_packet: hook_packet_manager_fn.parse_root,
    on_connected: (client, data) =>
      hook_packet_manager_fn.send("accept_connection", data)
  });

  const parse_packet = () => {
    const packets = hook_packet_manager_fn.pop("accept_connection");
    if (packets.length === 0) return;

    hook_connection_manager_fn.set_logged_as(
      settings.connection.accept_data.login
    );
  };

  const set_client = (client) => {
    hook_packet_manager_ref_client.current = client;
  };

  React.useEffect(() => set_client(hook_connection_manager_client), [
    hook_connection_manager_client
  ]);
  React.useEffect(() => parse_packet(), [hook_packet_manager_data]);

  const value = {
    context_connection_packets_data: hook_packet_manager_data,
    context_connection_info: hook_connection_manager_info,
    context_connection_client: hook_connection_manager_client,
    context_connection_fn: {
      send: (packet_id, packet_data) =>
        hook_packet_manager_fn.send(packet_id, packet_data),
      ...hook_packet_manager_fn,
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
