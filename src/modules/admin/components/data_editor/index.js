import React from "react";
import Select from "react-select";
import useSelectHook from "../../../../hooks/select_hook";
import { ProtocolContext } from "../../../../context/protocol";

import EditorScript from "./editor_script";
import EditorJS from "./editor_js";
import EditorYAML from "./editor_yaml";

function DataEditor(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const {
    hook_select_current_value,
    hook_select_options,
    hook_select_selected_option,
    hook_select_fn
  } = useSelectHook({
    default_value: "",
    create_label: (object) => object.id
  });

  const [state_data_config, set_state_data_config] = React.useState("");
  const [state_data_type, set_state_data_type] = React.useState("");

  const ref_data_config = React.useRef(state_data_config);
  ref_data_config.current = state_data_config;

  const set_title = (text) => {
    if (props != null && props.glContainer != null) {
      props.glContainer.setTitle(`Data editor - ${text}`);
    }
  };

  React.useEffect(() => {
    if (
      typeof hook_select_current_value !== "object" ||
      !("value" in hook_select_current_value)
    )
      return;

    const data_config = hook_select_current_value.value;

    if (data_config.validate === "script") set_state_data_type("script");
    else if (data_config.validate === "js") set_state_data_type("js");
    else if (typeof data_config.validate === "object")
      set_state_data_type("json");

    set_title(hook_select_current_value.id);
  }, [hook_select_current_value]);

  React.useEffect(() => {
    let data_config = null;
    for (const packet of context_packets_fn.peek("editor_config"))
      data_config = packet.data_config;

    if (state_data_config === "" && data_config != null) {
      set_state_data_config(data_config);

      const data_map = {};
      for (const [id, value] of Object.entries(data_config))
        data_map[id] = { id, value };

      hook_select_fn.update(data_map);
    }
  }, [context_packets_data]);

  React.useEffect(() => {
    const get_config = () => {
      if (ref_data_config.current === "") {
        context_packets_fn.send("editor_config", {});
        setTimeout(() => get_config(), 500);
      }
    };
    get_config();

    set_title("[Not set]");
  }, []);

  return (
    <React.Fragment>
      <Select
        styles={{
          // Fixes the overlapping problem of the component
          menu: (provided) => ({ ...provided, zIndex: 9999 })
        }}
        value={hook_select_selected_option}
        placeholder={`Select login data... [${
          Object.keys(hook_select_options).length
        }]`}
        onChange={hook_select_fn.on_change}
        options={hook_select_options}
        isClearable={false}
        isLoading={state_data_config === ""}
      />
      {state_data_type === "script" &&
        hook_select_current_value.value != null && (
          <EditorScript type={hook_select_current_value.id} />
        )}
      {state_data_type === "js" && hook_select_current_value.value != null && (
        <EditorJS type={hook_select_current_value.id} />
      )}
      {state_data_type === "json" && hook_select_current_value.value != null && (
        <React.Fragment>
          {/* <EditorJSON */}
          <EditorYAML
            rules={hook_select_current_value.value.validate}
            type={hook_select_current_value.id}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default DataEditor;
