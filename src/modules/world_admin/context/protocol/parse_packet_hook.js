import React from "react";
import SendPacket from "./send_packet";

function useParsePacketHook(props) {
  const ref_client = React.useRef();
  const [state_logged_as, set_state_logged_as] = React.useState("");
  const [state_scripts_list, set_state_scripts_list] = React.useState([]);

  const get_client = () => {
    return ref_client.current;
  };

  //parse packets
  const login = data => {
    set_state_logged_as(data.character_name);
    SendPacket.scripts_list(get_client(), {});
  };

  const scripts_list = data => {
    set_state_scripts_list({ ...data });
  };

  return {
    hook_parse_packet: {
      login: login,
      scripts_list: scripts_list
    },
    hook_logged_as: state_logged_as,
    hook_scripts_list: state_scripts_list,
    hook_ref_client: ref_client,
    hook_clear_logged_as: () => {
      set_state_logged_as("");
    }
  };
}

export default useParsePacketHook;
