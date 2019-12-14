import React from "react";
import useInterval from "react-useinterval";
import Client from "../../framework/client";
import SendPacket from "./send_packet";
import useParsePacketHook from "./parse_packet_hook";

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state_client, set_state_client] = React.useState();
  const [
    state_connection_enabled,
    set_state_connection_enabled
  ] = React.useState(true);
  const [state_connection_status, set_state_connection_status] = React.useState(
    "Disconnected"
  );
  const [
    state_reconnect_attempts,
    set_state_reconnect_attempts
  ] = React.useState(0);

  const {
    hook_parse_packet,
    hook_logged_in,
    hook_state_packet,
    hook_chat_received_message,
    hook_clear_chat_received_message
  } = useParsePacketHook();

  const create_parse_dict = () => {
    const parse_packet_dict = {};
    for (const [packet_id] of Object.entries(hook_parse_packet)) {
      parse_packet_dict[packet_id] = data => {
        return hook_parse_packet[packet_id](data);
      };
    }
    return parse_packet_dict;
  };

  const auto_check_connection = () => {
    let reconnect_attempts = 0;

    if (state_client === undefined || state_client == null) {
      // Client not set
      set_state_connection_status("Disconnected");
    } else if (!state_connection_enabled) {
      // Client set but possibility to connect disabled by user
      state_client.disconnect();
      set_state_connection_status("Disconnected");
    } else if (!state_client.is_connected()) {
      // Client set abut not connected
      state_client.connect();
      reconnect_attempts = state_reconnect_attempts + 1;
      set_state_connection_status(
        `Try to  connect... ${reconnect_attempts} times.`
      );
    } else if (!hook_logged_in) {
      // Client connected and try to log in
      if (state_reconnect_attempts < 10) {
        // Reconnecting until max attempts

        SendPacket.login(state_client);
        reconnect_attempts = state_reconnect_attempts + 1;
        set_state_connection_status(
          `Try to  login... ${reconnect_attempts}/10 times.`
        );
      } else {
        // Max attempts reached
        set_state_connection_status("Reconnecting...");
        state_client.disconnect();
      }
    } else {
      // Client connected
      set_state_connection_status("Connected");
    }

    set_state_reconnect_attempts(reconnect_attempts);
  };

  const toggle_sync = value => {
    set_state_connection_enabled(value);
  };

  React.useEffect(() => {
    try {
      const client = new Client({ url: "http://localhost:3000" });
      client.add_parse_packet_dict(create_parse_dict());
      set_state_client(client);
    } catch (error) {
      console.log("Disconnected: " + error);
    }
  }, []);

  const value = {
    context_on_toggle_sync: value => toggle_sync(value),
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
    context_source: hook_state_packet,
    context_connection_enabled: state_connection_enabled,
    context_connection_status: state_connection_status,
    contextValue: "default value"
  };

  useInterval(auto_check_connection, 1000);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
