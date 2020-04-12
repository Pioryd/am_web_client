import React from "react";
import { ProtocolContext } from "../../../../context/protocol";

function useProtocolHook(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_action_id, set_state_action_id] = React.useState("");
  const [state_objects, set_state_objects] = React.useState([]);
  const [state_rules, set_state_rules] = React.useState({});

  const can_perform_action = () => {
    if (state_action_id !== "") {
      props.log("You cannot perform action. Until last one will done.");
      return false;
    }
    return true;
  };

  const parse_fn_list = [
    () => {
      const packets = context_packets_fn.pop("process_" + props.ext_name);

      for (const packet of packets)
        props.log(
          `<${packet.action_id}>\n${JSON.stringify(packet.message, null, 2)}`
        );
    },
    () => {
      const packets = context_packets_fn.pop("update_" + props.ext_name);

      for (const packet of packets)
        props.log(
          `<${packet.action_id}>\n${JSON.stringify(packet.message, null, 2)}`
        );
    },
    () => {
      const packets = context_packets_fn.pop("data_" + props.ext_name);

      if (state_action_id === "") return;

      let action_id = null; // For searching needs
      let db_objects_list = null;
      let rules = null;
      let message = null;

      // Search for action_id
      for (const packet of packets) {
        if (packet.action_id === state_action_id) {
          action_id = state_action_id;
          db_objects_list = packet.db_objects_list;
          rules = packet.rules;
          message = packet.message;

          props.log(
            `<${packet.action_id}>\n${JSON.stringify(message, null, 2)}`
          );
          break;
        }
      }

      if (action_id != null) set_state_action_id("");
      if (db_objects_list != null) set_state_objects(db_objects_list);
      if (rules != null) set_state_rules(rules);
    }
  ];

  React.useEffect(() => {
    for (const parse_fn of parse_fn_list) parse_fn();
  }, [context_packets_data]);

  return {
    hook_protocol_objects_list: state_objects,
    hook_protocol_rules: state_rules,
    hook_protocol_action_id: state_action_id,
    hook_protocol_fn: {
      cancel_action: () => set_state_action_id(""),
      get: () => {
        if (can_perform_action() === false) return;

        const action_id = Date.now() + "_data";

        context_packets_fn.send("data_" + props.ext_name, { action_id });
        set_state_action_id(action_id);
      },
      new: function() {
        if (can_perform_action() === false) return;

        context_packets_fn.send("update_" + props.ext_name, {
          action: { id: Date.now() + "_update", type: "new" },
          object: null
        });

        this.get();
      },
      save: function(object) {
        if (can_perform_action() === false) return;

        try {
          context_packets_fn.send("update_" + props.ext_name, {
            action: { id: Date.now() + "_update", type: "update" },
            object: object
          });

          this.get();
        } catch (e) {
          props.log("Unable to save data");
        }
      },
      remove: function(object) {
        if (can_perform_action() === false) return;

        try {
          context_packets_fn.send("update_" + props.ext_name, {
            action: { id: Date.now() + "_update", type: "remove" },
            object: { id: object.id }
          });

          this.get();
        } catch (e) {
          props.log("Unable to save data");
        }
      },
      process: function(object) {
        if (can_perform_action() === false) return;

        try {
          context_packets_fn.send("process_" + props.ext_name, {
            action_id: Date.now() + "_process",
            object
          });
        } catch (e) {
          props.log("Unable to process data");
        }
      }
    }
  };
}

export default useProtocolHook;
