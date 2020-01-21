import React from "react";
import useClient from "../../../../hooks/client";
import AppContext from "../../../../context/app";
import SendCharacterPacket from "../../modules/world_character/protocol/send_character_packet";
import useParseCharacterPacketHook from "../../modules/world_character/protocol/parse_character_packet_hook";

export const ProtocolContext = React.createContext();

const ProtocolProvider = ({ children }) => {
  const { context_settings } = React.useContext(AppContext);

  const {
    hook_character_parse_packet,
    hook_character_logged_as,
    hook_character_admin,
    hook_character_data_full,
    hook_character_data_character,
    hook_character_data_world,
    hook_character_data_land,
    hook_character_packets_action_message,
    hook_character_packets_virtual_world,
    hook_character_ref_client,
    hook_character_pop_packets_action_message,
    hook_character_pop_packets_virtual_world
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
    settings: context_settings,
    parse_packet_map: hook_character_parse_packet
  });

  React.useEffect(() => {
    hook_character_ref_client.current = hook_client;
  }, [hook_client]);

  React.useEffect(() => {
    hook_set_logged_as(hook_character_logged_as);
  }, [hook_character_logged_as]);

  React.useEffect(() => {
    hook_update_settings(context_settings);
  }, [context_settings]);

  const value = {
    // Character
    context_character_send_process_script_action: (...args) => {
      SendCharacterPacket.process_script_action(hook_client, ...args);
    },
    context_character_send_change_position: (...args) => {
      SendCharacterPacket.data_character_change_position(hook_client, ...args);
    },
    context_character_send_change_land: (...args) => {
      SendCharacterPacket.data_character_change_land(hook_client, ...args);
    },
    context_character_send_add_friend: (...args) => {
      SendCharacterPacket.data_character_add_friend(hook_client, ...args);
    },
    context_character_send_remove_friend: (...args) => {
      SendCharacterPacket.data_character_remove_friend(hook_client, ...args);
    },
    context_character_send_change_state: (...args) => {
      SendCharacterPacket.data_character_change_state(hook_client, ...args);
    },
    context_character_send_change_action: (...args) => {
      SendCharacterPacket.data_character_change_action(hook_client, ...args);
    },
    context_character_send_change_activity: (...args) => {
      SendCharacterPacket.data_character_change_activity(hook_client, ...args);
    },
    context_character_send_action_message: (...args) => {
      SendCharacterPacket.action_message(hook_client, ...args);
    },
    context_character_send_enter_virtual_world: (...args) => {
      SendCharacterPacket.enter_virtual_world(hook_client, ...args);
    },
    context_character_send_leave_virtual_world: (...args) => {
      SendCharacterPacket.leave_virtual_world(hook_client, ...args);
    },
    context_character_send_virtual_world: (...args) => {
      SendCharacterPacket.virtual_world(hook_client, ...args);
    },
    context_character_logged_as: hook_character_logged_as,
    context_character_admin: hook_character_admin,
    context_character_data_full: hook_character_data_full,
    context_character_data_character: hook_character_data_character,
    context_character_data_land: hook_character_data_land,
    context_character_data_world: hook_character_data_world,
    context_character_packets_action_message: hook_character_packets_action_message,
    context_character_packets_virtual_world: hook_character_packets_virtual_world,
    context_character_pop_packets_action_message: hook_character_pop_packets_action_message,
    context_character_pop_packets_virtual_world: hook_character_pop_packets_virtual_world,

    // Other
    context_connection_toggle: value => hook_toggle_connection_enabled,
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
