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

  const send_map = {
    get() {
      if (can_perform_action() === false) return;

      const action_id = Date.now() + "_data";

      context_packets_fn.send("editor_data", {
        action_id,
        name: props.ext_name
      });
      set_state_action_id(action_id);
    },
    new() {
      if (can_perform_action() === false) return;

      context_packets_fn.send("editor_update", {
        action: { id: Date.now() + "_update", type: "new" },
        object: null,
        name: props.ext_name
      });
    },
    save(object) {
      if (can_perform_action() === false) return;

      try {
        context_packets_fn.send("editor_update", {
          action: { id: Date.now() + "_update", type: "update" },
          object: object,
          name: props.ext_name
        });
      } catch (e) {
        props.log("Unable to save data");
      }
    },
    remove(object) {
      if (can_perform_action() === false) return;

      try {
        context_packets_fn.send("editor_update", {
          action: { id: Date.now() + "_update", type: "remove" },
          object: { id: object.id },
          name: props.ext_name
        });
      } catch (e) {
        props.log("Unable to save data");
      }
    },
    process(object) {
      if (can_perform_action() === false) return;

      try {
        context_packets_fn.send("editor_process", {
          action_id: Date.now() + "_process",
          object,
          name: props.ext_name
        });
      } catch (e) {
        props.log("Unable to process data");
      }
    },
    replace_id(old_id, new_id) {
      if (can_perform_action() === false) return;

      try {
        context_packets_fn.send("editor_update", {
          action: { id: Date.now() + "_update", type: "replace_id" },
          old_id,
          new_id,
          name: props.ext_name
        });
      } catch (e) {
        props.log("Unable to replace id");
      }
    }
  };

  const parse_fn_list = [
    () => {
      const packets = context_packets_fn.pop(
        "editor_process_" + props.ext_name
      );

      for (const packet of packets)
        props.log(
          `<${packet.action_id}>\n${JSON.stringify(
            { message: packet.message },
            null,
            2
          )}`
        );
    },
    () => {
      const packets = context_packets_fn.pop("editor_update_" + props.ext_name);

      for (const packet of packets)
        props.log(
          `<${packet.action_id}>\n${JSON.stringify(
            { message: packet.message },
            null,
            2
          )}`
        );

      if (packets.length > 0) send_map.get();
    },
    () => {
      const packets = context_packets_fn.pop("editor_data_" + props.ext_name);

      if (state_action_id === "") return;

      let action_id = null; // For searching needs
      let objects_list = null;
      let rules = null;

      // Search for action_id
      for (const packet of packets) {
        if (packet.action_id === state_action_id) {
          action_id = state_action_id;
          objects_list = packet.objects_list;
          rules = packet.rules;

          props.log(
            `<${packet.action_id}>\n${JSON.stringify(
              { message: packet.message },
              null,
              2
            )}`
          );
          break;
        }
      }

      if (action_id != null) set_state_action_id("");
      if (objects_list != null) set_state_objects(objects_list);
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
      ...send_map
    }
  };
}

export default useProtocolHook;
