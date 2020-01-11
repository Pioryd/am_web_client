import React from "react";
import SendPacket from "./send_packet";

function useParsePacketHook(props) {
  const ref_client = React.useRef();
  const [state_logged_as, set_state_logged_as] = React.useState("");
  const [state_admin, set_state_admin] = React.useState("");
  const [state_data_full, set_state_data_full] = React.useState({});
  const [state_data_character, set_state_data_character] = React.useState({});
  const [state_data_land, set_state_data_land] = React.useState({});
  const [state_data_world, set_state_data_world] = React.useState({});
  const [state_received_messages, set_state_received_messages] = React.useState(
    []
  );

  const get_client = () => {
    return ref_client.current;
  };

  // parse packets
  const login = data => {
    set_state_logged_as(data.character_name);
    set_state_admin(data.admin);

    if (data.character_name.toLowerCase() === "admin") {
      SendPacket.data_full(get_client(), {});
    } else {
      SendPacket.data_character(get_client(), {});
      SendPacket.data_land(get_client(), {});
      SendPacket.data_world(get_client(), {});
    }
  };
  const data_full = data => {
    set_state_data_full({ ...data });
    SendPacket.data_full(get_client(), {});
  };
  const data_character = data => {
    set_state_data_character({ ...data });
    SendPacket.data_character(get_client(), {});
  };
  const data_land = data => {
    set_state_data_land({ ...data });
    SendPacket.data_land(get_client(), {});
  };
  const data_world = data => {
    set_state_data_world({ ...data });
    SendPacket.data_world(get_client(), {});
  };
  const action_message = data => {
    set_state_received_messages([...state_received_messages, { ...data }]);
  };

  // Other functions
  const pop_received_messages = () => {
    if (state_received_messages.length <= 0) return;

    const received_messages = [...state_received_messages];
    set_state_received_messages([]);
    return received_messages;
  };

  return {
    hook_parse_packet: {
      login: login,
      data_full: data_full,
      data_character: data_character,
      data_land: data_land,
      data_world: data_world,
      action_message: action_message
    },
    hook_logged_as: state_logged_as,
    hook_admin: state_admin,
    hook_data_full: state_data_full,
    hook_data_character: state_data_character,
    hook_data_land: state_data_land,
    hook_data_world: state_data_world,
    hook_received_messages: state_received_messages,
    hook_ref_client: ref_client,
    hook_pop_received_messages: pop_received_messages,
    hook_clear_logged_as: () => {
      set_state_logged_as("");
    },
    hook_clear_messages: () => {
      set_state_received_messages([]);
    }
  };
}

export default useParsePacketHook;
