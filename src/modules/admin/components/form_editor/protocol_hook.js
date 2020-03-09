import React from "react";
import Util from "../../../../framework/util";
import { ProtocolContext } from "../../../../context/protocol";

function useProtocolHook(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_action_id, set_state_action_id] = React.useState("");
  const [state_forms, set_state_forms] = React.useState({});

  const [state_last_log, set_state_last_log] = React.useState("");

  const update_last_log = message => {
    set_state_last_log(`"[${Util.get_time_hms()}] ${message}"`);
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
    const data_am_form = context_packets_fn.pop("data_am_form");

    if (state_action_id === "") return;

    let action_id = null; // For searching needs
    let forms = null;

    // Search for action_id
    for (const data of data_am_form) {
      if (data.action_id === state_action_id) {
        action_id = state_action_id;
        forms = data.forms;
        break;
      }
    }

    if (action_id != null) set_state_action_id("");
    if (forms != null) set_state_forms(forms);
  }, [context_packets_data]);

  return {
    hook_forms: state_forms,
    hook_protocol_last_log: state_last_log,
    hook_protocol_action_id: state_action_id,
    hook_protocol_fn: {
      cancel_action: () => {
        set_state_action_id("");
      },
      get_forms: () => {
        if (can_perform_action() === false) return;

        const action_id = Date.now();

        context_packets_fn.send("data_am_form", { action_id });
        set_state_action_id(action_id);
      },
      new_form: function() {
        if (can_perform_action() === false) return;

        context_packets_fn.send("update_am_form", {
          action_id: Date.now(),
          id: "",
          object: null
        });

        this.get_forms();
      },
      save_form: function(current_form) {
        if (can_perform_action() === false) return;
        if (!("id" in current_form)) return;

        context_packets_fn.send("update_am_form", {
          action_id: Date.now(),
          id: current_form.id,
          object: current_form
        });

        this.get_forms();
      },
      remove_form: function(current_form) {
        if (can_perform_action() === false) return;
        if (!("id" in current_form)) return;

        context_packets_fn.send("update_am_form", {
          action_id: Date.now(),
          id: current_form.id,
          object: null
        });

        this.get_forms();
      }
    }
  };
}

export default useProtocolHook;
