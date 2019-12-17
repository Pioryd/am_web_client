import React from "react";
import Client from "../../framework/client";
import SendPacket from "./send_packet";
import useParsePacketHook from "./parse_packet_hook";

export const AppContext = React.createContext();
const ADMIN_ID = -1;

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
  const [state_settings, set_state_settings] = React.useState({
    login: "",
    password: ""
  });

  const {
    hook_parse_packet,
    hook_logged_as,
    hook_state_packet,
    hook_chat_received_message,
    hook_clear_chat_received_message,
    hook_clear_logged_as
  } = useParsePacketHook();

  const ref_main_loop = React.useRef();
  const ref_check_connection = React.useRef();

  const _get_connection_id = () => {
    if (
      state_client !== undefined &&
      state_client != null &&
      state_client.is_connected()
    ) {
      return state_client.socket.id;
    } else {
      return "not set";
    }
  };

  const _update_hook_check_connections = () => {
    ref_check_connection.current = {
      state_client,
      state_connection_enabled,
      state_connection_status,
      set_state_connection_status,
      state_reconnect_attempts,
      set_state_reconnect_attempts,
      hook_logged_as,
      hook_clear_logged_as
    };
  };

  const _start_client = () => {
    const check_connection = _this => {
      let reconnect_attempts = 0;

      if (_this.state_client === undefined || _this.state_client == null) {
        // Client not set
        _this.set_state_connection_status("Disconnected");
      } else if (!_this.state_connection_enabled) {
        // Client set but possibility to connect disabled by user
        _this.state_client.disconnect("Connection disabled by user");
        _this.set_state_connection_status("Disconnected");
      } else if (!_this.state_client.is_connected()) {
        // Client set abut not connected
        _this.hook_clear_logged_as();
        _this.state_client.connect();
        reconnect_attempts = _this.state_reconnect_attempts + 1;
        _this.set_state_connection_status(
          `Try to  connect... ${reconnect_attempts} times.`
        );
      } else if (_this.hook_logged_as === "") {
        // Client connected and try to log in
        if (_this.state_reconnect_attempts < 10) {
          // Reconnecting until max attempts
          SendPacket.login(_this.state_client, ADMIN_ID);
          reconnect_attempts = _this.state_reconnect_attempts + 1;
          _this.set_state_connection_status(
            `Try to  login... ${reconnect_attempts}/10 times.`
          );
        } else {
          // Max attempts reached
          _this.set_state_connection_status("Reconnecting...");
          _this.state_client.disconnect("Reconnecting...");
        }
      } else {
        // Client connected
        _this.set_state_connection_status(
          "Connected as " + _this.hook_logged_as
        );
      }

      _this.set_state_reconnect_attempts(reconnect_attempts);
    };

    const main_loop = () => {
      const _this = ref_check_connection.current;
      check_connection(_this);
      if (_this.state_client !== undefined) _this.state_client.poll();
      ref_main_loop.current = setTimeout(() => {
        main_loop();
      }, 10);
    };

    try {
      const client = new Client({ url: "http://localhost:3000" });
      client.add_parse_packet_dict(create_parse_dict());
      set_state_client(client);
      _update_hook_check_connections();
      main_loop();
      return () => clearTimeout(ref_main_loop.current);
    } catch (error) {
      console.log("Disconnected: " + error);
    }
  };

  const create_parse_dict = () => {
    const parse_packet_dict = {};
    for (const [packet_id] of Object.entries(hook_parse_packet)) {
      parse_packet_dict[packet_id] = data => {
        return hook_parse_packet[packet_id](data);
      };
    }
    return parse_packet_dict;
  };

  const toggle_sync = value => {
    set_state_connection_enabled(value);
  };

  React.useEffect(() => {
    _start_client();
  }, []);

  React.useEffect(() => {
    _update_hook_check_connections();
  }, [
    state_client,
    state_connection_enabled,
    state_connection_status,
    set_state_connection_status,
    state_reconnect_attempts,
    set_state_reconnect_attempts,
    hook_logged_as,
    hook_clear_logged_as
  ]);

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
    context_connection_id: `Connection ID: ${_get_connection_id()}`,
    contextValue: "default value",
    context_settings: state_settings,
    context_set_settings: set_state_settings
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
