import React from "react";
import Client from "../../framework/client";
import Util from "../../framework/util";
import LoadingDots from "../../framework/loading_dots";
import SendCharacterPacket from "./send_character_packet";
import useParseCharacterPacketHook from "./parse_character_packet_hook";
import SendAdminPacket from "./send_admin_packet";
import useParseAdminPacketHook from "./parse_admin_packet_hook";

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state_settings, set_state_settings] = React.useState({
    login: "admin",
    password: "123",
    main_loop_sleep: 500,
    reconnect_attempts_interval: 1000,
    client_send_delay: 0,
    client_timeout: 25 * 1000,
    host: "localhost",
    port: "3000",
    type: "admin",
    start_as_connection_enabled: 1,
    ...Util.get_formated_url_path()
  });
  const [state_client, set_state_client] = React.useState();
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
    hook_character_pop_packets_virtual_world,
    hook_character_clear_logged_as
  } = useParseCharacterPacketHook();

  const {
    hook_admin_parse_packet,
    hook_admin_logged_as,
    hook_admin_scripts_list,
    hook_admin_ref_client,
    hook_admin_clear_logged_as
  } = useParseAdminPacketHook();

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
      hook_character_logged_as,
      hook_character_clear_logged_as,
      hook_admin_logged_as,
      hook_admin_clear_logged_as,
      state_settings
    };
  };

  const _start_client = () => {
    const check_connection = _this => {
      let logged_as = "";
      if (_this.hook_character_logged_as !== "")
        logged_as = _this.hook_character_logged_as;
      else if (_this.hook_admin_logged_as !== "")
        logged_as = _this.hook_admin_logged_as;

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
      } else if (_this.state_client.is_connected() && logged_as !== "") {
        _this.set_state_connection_status("Connected as " + logged_as);
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
        // TODO
        if (state_settings.type === "character") {
          SendCharacterPacket.login(_this.state_client, {
            login: _this.state_settings.login,
            password: _this.state_settings.password
          });
        } else {
          SendAdminPacket.login(_this.state_client, {
            login: _this.state_settings.login,
            password: _this.state_settings.password
          });
        }
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
      hook_character_ref_client.current = client;
      hook_admin_ref_client.current = client;
      _update_hook_check_connections();
      main_loop();
      return () => clearTimeout(ref_main_loop.current);
    } catch (error) {
      console.log("Disconnected: " + error);
    }
  };

  const create_parse_dict = () => {
    const parse_packet_dict = {};
    // TODO
    if (state_settings.type === "character") {
      for (const [packet_id] of Object.entries(hook_character_parse_packet)) {
        parse_packet_dict[packet_id] = data => {
          return hook_character_parse_packet[packet_id](data);
        };
      }
    } else {
      for (const [packet_id] of Object.entries(hook_admin_parse_packet)) {
        parse_packet_dict[packet_id] = data => {
          return hook_admin_parse_packet[packet_id](data);
        };
      }
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
    hook_character_logged_as,
    hook_character_clear_logged_as,
    hook_admin_logged_as,
    hook_admin_clear_logged_as,
    state_settings
  ]);

  const value = {
    // Character
    context_character_send_process_script_action: (...args) => {
      SendCharacterPacket.process_script_action(state_client, ...args);
    },
    context_character_send_change_position: (...args) => {
      SendCharacterPacket.data_character_change_position(state_client, ...args);
    },
    context_character_send_change_land: (...args) => {
      SendCharacterPacket.data_character_change_land(state_client, ...args);
    },
    context_character_send_add_friend: (...args) => {
      SendCharacterPacket.data_character_add_friend(state_client, ...args);
    },
    context_character_send_remove_friend: (...args) => {
      SendCharacterPacket.data_character_remove_friend(state_client, ...args);
    },
    context_character_send_change_state: (...args) => {
      SendCharacterPacket.data_character_change_state(state_client, ...args);
    },
    context_character_send_change_action: (...args) => {
      SendCharacterPacket.data_character_change_action(state_client, ...args);
    },
    context_character_send_change_activity: (...args) => {
      SendCharacterPacket.data_character_change_activity(state_client, ...args);
    },
    context_character_send_action_message: (...args) => {
      SendCharacterPacket.action_message(state_client, ...args);
    },
    context_character_send_enter_virtual_world: (...args) => {
      SendCharacterPacket.enter_virtual_world(state_client, ...args);
    },
    context_character_send_leave_virtual_world: (...args) => {
      SendCharacterPacket.leave_virtual_world(state_client, ...args);
    },
    context_character_send_virtual_world: (...args) => {
      SendCharacterPacket.virtual_world(state_client, ...args);
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
    // Admin
    context_admin_send_scripts_list: (...args) => {
      SendAdminPacket.scripts_list(state_client, ...args);
    },
    context_admin_send_process_script: (...args) => {
      SendAdminPacket.process_script(state_client, ...args);
    },
    context_admin_logged_as: hook_admin_logged_as,
    context_admin_scripts_list: hook_admin_scripts_list,
    context_admin_ref_client: hook_admin_ref_client,
    context_admin_clear_logged_as: hook_admin_clear_logged_as,
    // Other
    context_on_toggle_sync: value => toggle_sync(value),
    context_connection_enabled: state_connection_enabled,
    context_connection_status: state_connection_status,
    context_connection_id: `Connection ID: ${_get_connection_id()}`,
    context_settings: state_settings,
    context_set_settings: set_state_settings
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
