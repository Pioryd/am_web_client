import React from "react";
import useClient from "../../../../hooks/client";
import SendCharacterPacket from "./send_packet";
import useParseCharacterPacketHook from "./parse_packet_hook";

export const ProtocolContext = React.createContext();

const ProtocolProvider = ({ settings, children }) => {
  const {
    hook_parse_packet,
    hook_logged_as,
    hook_admin,
    hook_data_full,
    hook_data_character,
    hook_data_world,
    hook_data_land,
    hook_packets_action_message,
    hook_packets_virtual_world,
    hook_ref_client,
    hook_pop_packets_action_message,
    hook_pop_packets_virtual_world
  } = useParseCharacterPacketHook();

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
      SendCharacterPacket.login(...args);
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
    // Character
    context_send_process_script_action: (...args) => {
      SendCharacterPacket.process_script_action(hook_client, ...args);
    },
    context_send_change_position: (...args) => {
      SendCharacterPacket.data_character_change_position(hook_client, ...args);
    },
    context_send_change_land: (...args) => {
      SendCharacterPacket.data_character_change_land(hook_client, ...args);
    },
    context_send_add_friend: (...args) => {
      SendCharacterPacket.data_character_add_friend(hook_client, ...args);
    },
    context_send_remove_friend: (...args) => {
      SendCharacterPacket.data_character_remove_friend(hook_client, ...args);
    },
    context_send_change_state: (...args) => {
      SendCharacterPacket.data_character_change_state(hook_client, ...args);
    },
    context_send_change_action: (...args) => {
      SendCharacterPacket.data_character_change_action(hook_client, ...args);
    },
    context_send_change_activity: (...args) => {
      SendCharacterPacket.data_character_change_activity(hook_client, ...args);
    },
    context_send_action_message: (...args) => {
      SendCharacterPacket.action_message(hook_client, ...args);
    },
    context_send_enter_virtual_world: (...args) => {
      SendCharacterPacket.enter_virtual_world(hook_client, ...args);
    },
    context_send_leave_virtual_world: (...args) => {
      SendCharacterPacket.leave_virtual_world(hook_client, ...args);
    },
    context_send_virtual_world: (...args) => {
      SendCharacterPacket.virtual_world(hook_client, ...args);
    },
    context_logged_as: hook_logged_as,
    context_admin: hook_admin,
    context_data_full: hook_data_full,
    context_data_character: hook_data_character,
    context_data_land: hook_data_land,
    context_data_world: hook_data_world,
    context_packets_action_message: hook_packets_action_message,
    context_packets_virtual_world: hook_packets_virtual_world,
    context_pop_packets_action_message: hook_pop_packets_action_message,
    context_pop_packets_virtual_world: hook_pop_packets_virtual_world,

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
