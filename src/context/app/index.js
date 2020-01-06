import React from "react";
import Client from "../../framework/client";
import Util from "../../framework/util";
import SendPacket from "./send_packet";
import useParsePacketHook from "./parse_packet_hook";
import useStopWatch from "../../hooks/stop_watch.js";

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state_settings, set_state_settings] = React.useState({
    login: Util.get_url_path(),
    password: "123",
    main_loop_sleep: 1000,
    reconnect_attempts_interval: 1000,
    client_send_delay: 0,
    client_timeout: 3 * 1000,
    client_server_url: "http://localhost:3000",
    start_as_connection_enabled: true
  });
  const [state_client, set_state_client] = React.useState();
  const [
    state_connection_enabled,
    set_state_connection_enabled
  ] = React.useState(state_settings.start_as_connection_enabled);
  const [state_connection_status, set_state_connection_status] = React.useState(
    "Disconnected"
  );
  const [
    state_reconnect_attempts,
    set_state_reconnect_attempts
  ] = React.useState(0);

  const {
    hook_parse_packet,
    hook_logged_as,
    hook_admin,
    hook_data_full,
    hook_data_character,
    hook_data_world,
    hook_data_land,
    hook_received_messages,
    hook_pop_received_messages,
    hook_clear_messages,
    hook_clear_logged_as
  } = useParsePacketHook();

  const ref_main_loop = React.useRef();
  const ref_check_connection = React.useRef();

  const stop_watch = useStopWatch();

  const _get_connection_id = () => {
    if (
      state_client != null &&
      state_client != null &&
      state_client.is_connected()
    ) {
      return state_client.socket.id;
    } else {
      return "not set";
    }
  };

  // If you add new object here, you need to add it too in useEffect
  // bellow with same list.
  const _update_hook_check_connections = () => {
    ref_check_connection.current = {
      state_client,
      state_connection_enabled,
      state_connection_status,
      set_state_connection_status,
      state_reconnect_attempts,
      set_state_reconnect_attempts,
      hook_logged_as,
      hook_clear_logged_as,
      stop_watch,
      state_settings
    };
  };

  const _start_client = () => {
    const check_connection = _this => {
      let reconnect_attempts = 0;

      if (_this.state_client == null || _this.state_client == null) {
        // Client not set

        _this.set_state_connection_status("Disconnected");
      } else if (!_this.state_connection_enabled) {
        // Client set but possibility to connect disabled by user

        _this.state_client.disconnect("Connection disabled by user");
        _this.set_state_connection_status("Disconnected");
      } else if (!_this.state_client.is_connected()) {
        // Client set but not connected

        if (
          _this.stop_watch.get_elapsed_milliseconds() <
          _this.state_settings.reconnect_attempts_interval
        )
          return;
        _this.stop_watch.reset();

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

          if (
            _this.stop_watch.get_elapsed_milliseconds() <
            _this.state_settings.reconnect_attempts_interval
          )
            return;
          _this.stop_watch.reset();

          SendPacket.login(_this.state_client, {
            login: _this.state_settings.login,
            password: _this.state_settings.password
          });
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

    const main_loop = async () => {
      const _this = ref_check_connection.current;
      check_connection(_this);

      if (_this.state_client != null) _this.state_client.poll();

      ref_main_loop.current = setTimeout(() => {
        main_loop();
      }, _this.state_settings.main_loop_sleep);
    };

    try {
      const client = new Client({
        url: state_settings.client_server_url,
        send_delay: state_settings.client_send_delay,
        timeout: state_settings.timeout
      });
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
    if (state_client == null) return;

    state_client.set_send_delay(state_settings.client_send_delay);
    state_client.set_timeout(state_settings.client_timeout);
  }, [state_settings]);

  // If you add new object here, you need to add it too in function
  // {_update_hook_check_connections} with same list.
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
    hook_clear_logged_as,
    stop_watch,
    state_settings
  ]);

  const value = {
    context_on_toggle_sync: value => toggle_sync(value),
    context_change_position: (...args) => {
      SendPacket.data_character_change_position(state_client, ...args);
    },
    context_change_land: (...args) => {
      SendPacket.data_character_change_land(state_client, ...args);
    },
    context_add_friend: (...args) => {
      SendPacket.data_character_add_friend(state_client, ...args);
    },
    context_remove_friend: (...args) => {
      SendPacket.data_character_remove_friend(state_client, ...args);
    },
    context_change_state: (...args) => {
      SendPacket.data_character_change_state(state_client, ...args);
    },
    context_change_action: (...args) => {
      SendPacket.data_character_change_action(state_client, ...args);
    },
    context_change_activity: (...args) => {
      SendPacket.data_character_change_activity(state_client, ...args);
    },
    context_send_message: (...args) => {
      SendPacket.action_message(state_client, ...args);
    },
    context_logged_as: hook_logged_as,
    context_admin: hook_admin,
    context_data_full: hook_data_full,
    context_data_character: hook_data_character,
    context_data_land: hook_data_land,
    context_data_world: hook_data_world,
    context_received_messages: hook_received_messages,
    context_pop_received_messages: hook_pop_received_messages,
    context_clear_received_messages: hook_clear_messages,
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
