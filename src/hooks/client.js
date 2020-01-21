import React from "react";
import Client from "../framework/client";

import LoadingDots from "../framework/loading_dots";

const useClient = props => {
  const [state_client, set_state_client] = React.useState();
  const [state_settings, set_state_settings] = React.useState(props.settings);
  const [
    state_connection_enabled,
    set_state_connection_enabled
    // can be number, so ==
  ] = React.useState(state_settings.start_as_connection_enabled == true);
  const [state_connection_status, set_state_connection_status] = React.useState(
    "Disconnected"
  );

  const [state_loading_dots] = React.useState(
    new LoadingDots({ interval: 1000 })
  );

  const [state_logged_as, set_state_logged_as] = React.useState("");
  const ref_main_loop = React.useRef();
  const ref_check_connection = React.useRef();

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
      state_logged_as,
      set_state_logged_as,
      state_settings: state_settings
    };
  };

  const _start_client = () => {
    const check_connection = _this => {
      if (_this.state_client == null || _this.state_client == null) {
        _this.set_state_connection_status("Disconnected");
      } else if (
        _this.state_connection_enabled &&
        _this.state_client.auto_reconnect_data.enabled === false
      ) {
        _this.state_client.auto_reconnect_data.enabled = true;
      } else if (!_this.state_connection_enabled) {
        _this.state_client.auto_reconnect_data.enabled = false;
        _this.state_client.disconnect("Connection disabled by user");
        _this.set_state_connection_status("Disconnected");
      } else if (
        _this.state_client.is_connected() &&
        _this.state_logged_as !== ""
      ) {
        _this.set_state_connection_status(
          "Connected as " + _this.state_logged_as
        );
      } else {
        _this.set_state_connection_status(
          "Connecting" + state_loading_dots.get_dots()
        );
      }
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
        url: `http://${state_settings.host}:${state_settings.port}`,
        options: {
          send_delay: state_settings.client_send_delay,
          packet_timeout: state_settings.client_timeout,
          auto_reconnect: true,
          debug: true
        }
      });
      client.logger.options = {
        ...client.logger.options,
        print_log: true,
        print_info: true,
        print_error: true,
        print_warn: true,
        print_debug: true
      };
      client.add_parse_packet_dict(create_parse_dict());
      client.events.connected = () => {
        console.log("client.connected");
        const _this = ref_check_connection.current;
        _this.set_state_connection_status("Logging in...");

        props.on_connected(_this.state_client, {
          login: _this.state_settings.login,
          password: _this.state_settings.password
        });
      };
      client.events.disconnected = () => {
        console.log("client.disconnected");
        const _this = ref_check_connection.current;
        _this.set_state_connection_status("Disconnected");
      };
      client.events.reconnecting = () => {
        console.log("client.reconnecting");
        const _this = ref_check_connection.current;
        _this.set_state_connection_status("Reconnecting...");
      };
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

    for (const [packet_id] of Object.entries(props.parse_packet_map)) {
      parse_packet_dict[packet_id] = data => {
        return props.parse_packet_map[packet_id](data);
      };
    }

    return parse_packet_dict;
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
    state_logged_as,
    set_state_logged_as,
    state_settings
  ]);

  return {
    hook_update_settings: set_state_settings,
    hook_toggle_connection_enabled: set_state_connection_enabled,
    hook_set_logged_as: set_state_logged_as,
    hook_client: state_client,
    hook_connection_enabled: state_connection_enabled,
    hook_connection_status: state_connection_status,
    hook_connection_id: `Connection ID: ${_get_connection_id()}`
  };
};

export default useClient;
