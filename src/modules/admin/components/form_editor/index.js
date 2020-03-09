import React from "react";
import Select from "react-select";
import { JsonTree } from "react-editable-json-tree";

import useEditJson from "./edit_json_hook";
import useProtocolHook from "./protocol_hook";

function FormEditor() {
  const {
    hook_edit_json_last_log,
    hook_current_form,
    hook_data_changed,
    hook_edit_json_fn
  } = useEditJson();

  const {
    hook_forms,
    hook_protocol_last_log,
    hook_protocol_action_id,
    hook_protocol_fn
  } = useProtocolHook();

  const [state_options, set_state_options] = React.useState([]);
  const [state_selected_option, set_state_selected_option] = React.useState("");

  // Handle select
  React.useEffect(() => {
    const options = state_options;
    const label = state_selected_option.label;

    let form = {};
    for (const option of options) {
      if (option.label === label) form = option.value;
    }

    hook_edit_json_fn.set_current_form(form);
  }, [state_selected_option]);

  // Parse packet
  React.useEffect(() => {
    let options = null;
    let current_form = null;
    let selected_option = null;

    options = [];
    current_form = {};

    selected_option = "";

    for (const form of Object.values(hook_forms))
      options.push({ label: form.id + "_" + form.name, value: form });

    if ("id" in hook_current_form) {
      for (const option of options) {
        const form = option.value;

        if (form.id === hook_current_form.id) {
          selected_option = option;
          current_form = form;
          break;
        }
      }
    }

    if (options != null) set_state_options(options);
    if (current_form != null) hook_edit_json_fn.set_current_form(current_form);
    if (selected_option != null) set_state_selected_option(selected_option);
  }, [hook_forms]);

  return (
    <div className="content_body">
      <div className="bar">
        <button
          onClick={() => {
            hook_protocol_fn.get_forms(hook_current_form);
          }}
        >
          refresh
        </button>
        <button
          onClick={() => {
            hook_protocol_fn.new_form(hook_current_form);
          }}
        >
          new
        </button>
        <button
          onClick={() => {
            hook_protocol_fn.save_form(hook_current_form);
          }}
        >
          save
        </button>
        <button
          onClick={() => {
            hook_protocol_fn.remove_form(hook_current_form);
          }}
        >
          remove
        </button>
      </div>
      <div className="bar">
        <label>{hook_protocol_last_log}</label>
      </div>
      <div>
        <Select
          value={state_selected_option}
          placeholder="Select form..."
          onChange={option => {
            set_state_selected_option(option);
          }}
          options={state_options}
        />
      </div>
      <div className="bar">
        <label>{hook_edit_json_last_log}</label>
      </div>
      <div className="form_editor">
        {hook_data_changed === true && (
          <div className="bar">
            <label style={{ color: "red" }}>Save to apply changes</label>
          </div>
        )}
        {hook_protocol_action_id !== "" ? (
          <React.Fragment>
            <p>{`Waiting for the end of the action[${hook_protocol_action_id}]`}</p>
            <button
              onClick={() => {
                hook_protocol_fn.cancel_action();
              }}
            >
              cancel action
            </button>
          </React.Fragment>
        ) : (
          <JsonTree
            rootName="state_settings"
            data={hook_current_form}
            onDeltaUpdate={hook_edit_json_fn.on_delta_update}
            beforeRemoveAction={hook_edit_json_fn.on_remove}
            beforeUpdateAction={hook_edit_json_fn.on_update}
            isCollapsed={() => {
              return false;
            }}
          />
        )}
      </div>
    </div>
  );
}

export default FormEditor;
