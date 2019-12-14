import React from "react";

function useParsePacketHook(props) {
  const [state_packet, set_state_packet] = React.useState();
  const [
    state_chat_received_message,
    set_state_chat_received_message
  ] = React.useState();
  const [state_logged_in, set_state_logged_in] = React.useState(false);

  const login = packet => {
    set_state_logged_in(true);
    return { id: "update", data: {} };
  };

  const update = packet => {
    set_state_packet(packet);
    return { id: "update", data: {}, delay: 2000 };
  };

  const chat_message = data => {
    set_state_chat_received_message(data.message);
  };

  return {
    hook_parse_packet: {
      login: login,
      update: update,
      chat_message: chat_message
    },
    hook_logged_in: state_logged_in,
    hook_state_packet: state_packet,
    hook_chat_received_message: state_chat_received_message,
    hook_clear_chat_received_message: () => {
      set_state_chat_received_message("");
    }
  };
}

export default useParsePacketHook;
