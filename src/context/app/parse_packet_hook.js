import React from "react";

function useParsePacketHook(props) {
  const [state_logged_as, set_state_logged_as] = React.useState("");
  const [state_admin, set_state_admin] = React.useState("");
  const [state_data_full, set_state_data_full] = React.useState({});
  const [state_data_character, set_state_data_character] = React.useState({});
  const [state_data_world, set_state_data_world] = React.useState({});
  const [state_received_messages, set_state_received_messages] = React.useState(
    []
  );

  // parse
  const login = data => {
    set_state_logged_as(data.character_name);
    set_state_admin(data.admin);

    if (data.character_name.toLowerCase() === "admin")
      return { packet_id: "data_full", data: {} };
    else
      return [
        { packet_id: "data_character", data: {} },
        { packet_id: "data_world", data: {} }
      ];
  };

  const data_full = data => {
    set_state_data_full({ ...data });
    return { packet_id: "data_full", data: {} };
  };
  const data_character = data => {
    set_state_data_character({ ...data });
    return { packet_id: "data_character", data: {} };
  };
  const data_world = data => {
    set_state_data_world({ ...data });
    return { packet_id: "data_world", data: {} };
  };

  const event_world_earthquake = data => {};

  const action_message = data => {
    set_state_received_messages([...state_received_messages, { ...data }]);
  };

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
      data_world: data_world,
      event_world_earthquake: event_world_earthquake,
      action_message: action_message
    },
    hook_logged_as: state_logged_as,
    hook_admin: state_admin,
    hook_data_full: state_data_full,
    hook_data_character: state_data_character,
    hook_data_world: state_data_world,
    hook_received_messages: state_received_messages,
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
