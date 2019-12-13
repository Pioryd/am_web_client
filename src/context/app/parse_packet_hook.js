import React from "react";

function useParsePacketHook(props) {
  const [
    state_chat_received_message,
    set_state_chat_received_message
  ] = React.useState();

  const update = (packet, app_context) => {
    let data = {};
    data.command = "update";
    return data;
  };

  const chat_message = (packet, app_context) => {
    set_state_chat_received_message(packet.message);
  };

  return {
    hook_parse_packet: { update: update, chat_message: chat_message },
    hook_chat_received_message: state_chat_received_message,
    hook_clear_chat_received_message: () => {
      set_state_chat_received_message("");
    }
  };
}

export default useParsePacketHook;
