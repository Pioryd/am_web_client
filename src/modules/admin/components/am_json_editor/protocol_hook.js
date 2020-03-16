import React from "react";
import Util from "../../../../framework/util";
import { ProtocolContext } from "../../../../context/protocol";

function useProtocolHook(props) {
  const [state_mode] = React.useState(props.mode);
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_action_id, set_state_action_id] = React.useState("");
  const [state_json_data, set_state_json_data] = React.useState({});
  const [state_json_rules, set_state_json_rules] = React.useState({});

  const [state_last_log, set_state_last_log] = React.useState("");

  const update_last_log = message => {
    if (message === "") set_state_last_log("");
    else set_state_last_log(`"[${Util.get_time_hms()}] ${message}"`);
  };

  const can_perform_action = () => {
    if (state_action_id !== "") {
      update_last_log("You cannot perform action. Until last one will done.");
      return false;
    }
    return true;
  };

  // Parse packet
  React.useEffect(() => {
    const data_am = context_packets_fn.pop("data_am_" + state_mode);

    if (state_action_id === "") return;

    let action_id = null; // For searching needs
    let json_data = null;
    let json_data_rules = null;

    // Search for action_id
    for (const data of data_am) {
      if (data.action_id === state_action_id) {
        action_id = state_action_id;
        json_data = data.list;
        json_data_rules = data.rules;
        break;
      }
    }

    if (action_id != null) set_state_action_id("");
    if (json_data != null) set_state_json_data(json_data);
    if (json_data_rules != null) set_state_json_rules(json_data_rules);
  }, [context_packets_data]);

  return {
    hook_protocol_json_data: state_json_data,
    hook_protocol_json_rules: state_json_rules,
    hook_protocol_last_log: state_last_log,
    hook_protocol_action_id: state_action_id,
    hook_protocol_fn: {
      cancel_action: () => {
        set_state_action_id("");
        update_last_log("");
      },
      get: () => {
        if (can_perform_action() === false) return;

        const action_id = Date.now();

        context_packets_fn.send("data_am_" + state_mode, { action_id });
        set_state_action_id(action_id);
      },
      new: function() {
        if (can_perform_action() === false) return;

        context_packets_fn.send("update_am_" + state_mode, {
          action_id: Date.now(),
          id: "",
          object: null
        });

        this.get();
      },
      save: function(current_json_data) {
        if (can_perform_action() === false) return;

        context_packets_fn.send("update_am_" + state_mode, {
          action_id: Date.now(),
          id: current_json_data.id,
          object: current_json_data
        });

        this.get();
      },
      remove: function(current_json_data) {
        if (can_perform_action() === false) return;

        context_packets_fn.send("update_am_" + state_mode, {
          action_id: Date.now(),
          id: current_json_data.id,
          object: null
        });

        this.get();
      }
    }
  };
}

export default useProtocolHook;
