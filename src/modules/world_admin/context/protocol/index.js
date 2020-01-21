import React from "react";
import useClient from "../../../../hooks/client";
import SendAdminPacket from "./send_admin_packet";
import useParseAdminPacketHook from "./parse_admin_packet_hook";

export const ProtocolContext = React.createContext();

const ProtocolProvider = ({ settings, children }) => {
  const {
    hook_admin_parse_packet,
    hook_admin_logged_as,
    hook_admin_scripts_list,
    hook_admin_ref_client,
    hook_admin_clear_logged_as
  } = useParseAdminPacketHook();

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
    parse_packet_map: hook_admin_parse_packet,
    on_connected: (...args) => {
      SendAdminPacket.login(...args);
    }
  });

  React.useEffect(() => {
    hook_admin_ref_client.current = hook_client;
  }, [hook_client]);

  React.useEffect(() => {
    hook_set_logged_as(hook_admin_logged_as);
  }, [hook_admin_logged_as]);

  React.useEffect(() => {
    hook_update_settings(settings);
  }, [settings]);

  const value = {
    context_send_scripts_list: (...args) => {
      SendAdminPacket.scripts_list(hook_client, ...args);
    },
    context_send_process_script: (...args) => {
      SendAdminPacket.process_script(hook_client, ...args);
    },
    context_logged_as: hook_admin_logged_as,
    context_scripts_list: hook_admin_scripts_list,
    context_ref_client: hook_admin_ref_client,
    context_clear_logged_as: hook_admin_clear_logged_as,

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
