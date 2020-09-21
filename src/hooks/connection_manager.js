import React from "react";
import Client from "../framework/client";
import LoadingDots from "../framework/loading_dots";

const useConnectionManagerHook = (props) => {
  const [state_client, set_state_client] = React.useState();
  const [state_settings, set_state_settings] = React.useState(props.settings);
  const [
    state_connection_enabled,
    set_state_connection_enabled
    // can be number, so ==
  ] = React.useState(state_settings.connection.start_as_enabled == true);
  const [state_connection_status, set_state_connection_status] = React.useState(
    "Disconnected"
  );
  const [state_logged_as, set_state_logged_as] = React.useState("");
  const [state_loading_dots] = React.useState(
    new LoadingDots({ interval: 1000 })
  );

  const ref_main_loop = React.useRef();
  const ref_check_connection = React.useRef();

  const _get_connection_id = () =>
    state_client != null && state_client.is_connected()
      ? state_client.socket.id
      : "not set";

  // If you add new object here, you need to add it too in useEffect
  // bellow with same list.
  const _update_hook_check_connections = () => {
    ref_check_connection.current = {
      state_client,
      state_connection_enabled,
      state_connection_status,
      set_state_connection_status,
      state_logged_as,
      state_settings: state_settings
    };
  };

  const _start_client = () => {
    const check_connection = (_this) => {
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

      ref_main_loop.current = setTimeout(
        () => main_loop(),
        _this.state_settings.connection.poll_interval
      );
    };

    try {
      const client = new Client({
        url: `http://${state_settings.connection.host}:${state_settings.connection.port}`,
        options: {
          send_delay: state_settings.connection.send_delay,
          packet_timeout: state_settings.connection.packet_timeout,
          auto_reconnect: state_settings.connection.auto_reconnect,
          debug: state_settings.connection.debug
        }
      });
      client.ext.connection_accepted = false;
      client.logger.options = {
        ...client.logger.options,
        ...state_settings.connection.logger
      };
      client.add_parse_packet_dict({ root: props.parse_root_packet });
      client.events.connected = () => {
        console.log("Client connected");
        const _this = ref_check_connection.current;
        _this.set_state_connection_status("Logging in...");
        _this.state_client.ext.connection_accepted = false;
        props.on_connected(_this.state_client, {
          ..._this.state_settings.connection.accept_data
        });
      };
      client.events.disconnected = () => {
        console.log("Client disconnected");
        const _this = ref_check_connection.current;
        _this.set_state_connection_status("Disconnected");
        _this.state_client.ext.connection_accepted = false;
      };
      client.events.reconnecting = () => {
        console.log("Client reconnecting");
        const _this = ref_check_connection.current;
        _this.set_state_connection_status("Reconnecting...");
        _this.state_client.ext.connection_accepted = false;
      };
      set_state_client(client);
      _update_hook_check_connections();
      main_loop();
      return () => clearTimeout(ref_main_loop.current);
    } catch (error) {
      console.log("Client disconnected: " + error);
    }
  };

  const on_settings_change = () => {
    if (state_client == null) return;

    state_client.options = {
      send_delay: state_settings.connection.send_delay,
      packet_timeout: state_settings.connection.packet_timeout,
      auto_reconnect: state_settings.connection.auto_reconnect,
      debug: state_settings.connection.debug
    };
    state_client.logger.options = {
      ...state_client.logger.options,
      ...state_settings.connection.logger
    };
    state_client.set_send_delay(state_settings.connection.send_delay);
    state_client.set_timeout(state_settings.connection.packet_timeout);
  };

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
    state_settings
  ]);
  React.useEffect(() => _start_client(), []);
  React.useEffect(() => on_settings_change(), [state_settings]);

  return {
    hook_connection_manager_info: {
      enabled: state_connection_enabled,
      status: state_connection_status,
      id: _get_connection_id()
    },
    hook_connection_manager_client: state_client,
    hook_connection_manager_fn: {
      set_settings: set_state_settings,
      set_connection_enabled: set_state_connection_enabled,
      set_logged_as: set_state_logged_as
    }
  };
};

export default useConnectionManagerHook;
