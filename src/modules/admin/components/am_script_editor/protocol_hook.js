import React from "react";
import Util from "../../../../framework/util";
import AML from "../../../../framework/aml";

import { ProtocolContext } from "../../../../context/protocol";

function useProtocolHook(props) {
  const [state_mode] = React.useState("script");
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_action_id, set_state_action_id] = React.useState("");
  const [state_script_data, set_state_script_data] = React.useState([]);
  const [state_script_rules, set_state_script_rules] = React.useState({});

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

  const parse_update_am = () => {
    const update_am = context_packets_fn.pop("update_am_" + state_mode);

    let log = "";
    for (const data of update_am) log += `<${data.action_id}> ${data.message}`;

    if (log !== "") set_state_last_log(log);
  };

  const parse_data_am = () => {
    const data_am = context_packets_fn.pop("data_am_" + state_mode);

    if (state_action_id === "") return;

    let action_id = null; // For searching needs
    let script_data = null;
    let script_data_rules = null;

    // Search for action_id
    for (const data of data_am) {
      if (data.action_id === state_action_id) {
        action_id = state_action_id;
        script_data = data.list;
        break;
      }
    }

    if (action_id != null) set_state_action_id("");
    if (script_data != null) set_state_script_data(script_data);
    if (script_data_rules != null) set_state_script_rules(script_data_rules);
  };

  // Parse packet
  React.useEffect(() => {
    parse_update_am();
    parse_data_am();
  }, [context_packets_data]);

  return {
    hook_protocol_script_data: state_script_data,
    hook_protocol_script_rules: state_script_rules,
    hook_protocol_last_log: state_last_log,
    hook_protocol_action_id: state_action_id,
    hook_protocol_fn: {
      cancel_action: () => set_state_action_id(""),
      get: () => {
        if (can_perform_action() === false) return;

        const action_id = Date.now() + "_data";

        context_packets_fn.send("data_am_" + state_mode, { action_id });
        set_state_action_id(action_id);
      },
      new: function() {
        if (can_perform_action() === false) return;

        context_packets_fn.send("update_am_" + state_mode, {
          action_id: Date.now() + "_update",
          id: "",
          object: null
        });

        this.get();
      },
      save: function(current_script_source) {
        if (can_perform_action() === false) return;

        try {
          const id = AML.parse(current_script_source).id;

          context_packets_fn.send("update_am_" + state_mode, {
            action_id: Date.now() + "_update",
            id,
            object: current_script_source
          });

          this.get();
        } catch (e) {
          update_last_log("Unable to save data");
        }
      },
      remove: function(current_script_source) {
        if (can_perform_action() === false) return;

        try {
          const id = AML.parse(current_script_source).id;

          context_packets_fn.send("update_am_" + state_mode, {
            action_id: Date.now() + "_update",
            id,
            object: null
          });

          this.get();
        } catch (e) {
          update_last_log("Unable to save data");
        }
      }
    }
  };
}

export default useProtocolHook;
