import React from "react";
import Client from "../../framework/client";
import SendPacket from "./send_packet";
import useParsePacketHook from "./parse_packet_hook";

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state_packet, set_state_packet] = React.useState();
  const [state_client, set_state_client] = React.useState();

  const {
    hook_parse_packet,
    hook_chat_received_message,
    hook_clear_chat_received_message
  } = useParsePacketHook();

  const create_parse_dict = () => {
    return {
      world: packet => {
        set_state_packet(packet);
        if (packet.command in hook_parse_packet)
          return hook_parse_packet[packet.command](packet, this);
      }
    };
  };

  const toggle_sync = value => {
    if (value === true) {
      state_client.connect();
      SendPacket.update(state_client);
    } else {
      state_client.disconnect();
    }
  };

  const change_sync_interval = interval => {
    state_client.sync_interval = interval;
  };

  React.useEffect(() => {
    set_state_client(new Client("http://localhost:3000", create_parse_dict()));
  }, []);

  const value = {
    context_on_toggle_sync: value => toggle_sync(value),
    context_on_change_sync_interval: change_sync_interval,
    context_change_position: (...args) => {
      SendPacket.change_position(state_client, ...args);
    },
    context_change_land: (...args) => {
      SendPacket.change_land(state_client, ...args);
    },
    context_add_friend: (...args) => {
      SendPacket.add_friend(state_client, ...args);
    },
    context_send_message: (...args) => {
      SendPacket.send_message(state_client, ...args);
    },
    context_chat_received_message: hook_chat_received_message,
    context_clear_chat_received_message: hook_clear_chat_received_message,
    context_source: state_packet,
    contextValue: "default value"
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
