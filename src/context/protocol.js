import React from "react";
import Util from "../framework/util";
import useConnectionManager from "../hooks/connection_manager";

import admin_useParsePacketHook from "../modules/admin/hooks/parse_packet";
import world_character_useParsePacketHook from "../modules/world_character/hooks/parse_packet";

let useParsePacketHook = {};
const module_name = Util.get_formatted_url_path().module;
if (module_name === "admin") {
  useParsePacketHook = admin_useParsePacketHook;
} else if (module_name === "world_character") {
  useParsePacketHook = world_character_useParsePacketHook;
}

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
    hook_connection_info,
    hook_client
  } = useConnectionManager({
    settings: settings,
    parse_packet_map: hook_parse_packet,
    on_connected: (client, data) => {
      hook_packets_fn.send("accept_connection", data);
    }
  });

  React.useEffect(() => {
    hook_ref_client.current = hook_client;
  }, [hook_client]);

  React.useEffect(() => {
    const packets = hook_packets_fn.pop("accept_connection");
    if (packets.length === 0) return;
    hook_connection_manager_fn.set_logged_as(packets.pop().user_name);
  }, [hook_packets_data]);

  React.useEffect(() => {
    hook_connection_manager_fn.set_settings(settings);
  }, [settings]);

  const value = {
    context_packets_data: hook_packets_data,
    context_packets_fn: {
      send: (packet_id, packet_data) =>
        hook_packets_fn.send(packet_id, packet_data),
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
