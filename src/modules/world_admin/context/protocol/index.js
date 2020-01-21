import React from "react";
import useClient from "../../../../hooks/client";
import SendPacket from "./send_packet";
import useParsePacketHook from "./parse_packet_hook";

export const ProtocolContext = React.createContext();

const ProtocolProvider = ({ settings, children }) => {
  const {
    hook_parse_packet,
    hook_logged_as,
    hook_scripts_list,
    hook_ref_client,
    hook_clear_logged_as
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
    on_connected: (...args) => {
      SendPacket.login(...args);
    }
  });

  React.useEffect(() => {
    hook_ref_client.current = hook_client;
  }, [hook_client]);

  React.useEffect(() => {
    hook_set_logged_as(hook_logged_as);
  }, [hook_logged_as]);

  React.useEffect(() => {
    hook_update_settings(settings);
  }, [settings]);

  const value = {
    context_send_scripts_list: (...args) => {
      SendPacket.scripts_list(hook_client, ...args);
    },
    context_send_process_script: (...args) => {
      SendPacket.process_script(hook_client, ...args);
    },
    context_logged_as: hook_logged_as,
    context_scripts_list: hook_scripts_list,
    context_ref_client: hook_ref_client,
    context_clear_logged_as: hook_clear_logged_as,

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
