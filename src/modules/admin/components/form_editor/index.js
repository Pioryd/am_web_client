import React from "react";
import Select from "react-select";
import { JsonTree } from "react-editable-json-tree";

import useEditJson from "./edit_json_hook";
import useProtocolHook from "./protocol_hook";
import useSelectHook from "./select_hook";

function FormEditor() {
  const {
    hook_edit_json_last_log,
    hook_current_form,
    hook_data_changed,
    hook_edit_json_fn
  } = useEditJson();

  const {
    hook_protocol_forms,
    hook_protocol_last_log,
    hook_protocol_action_id,
    hook_protocol_fn
  } = useProtocolHook();

  const {
    hook_current_value,
    hook_select_options,
    hook_selected_option,
    hook_select_fn
  } = useSelectHook();

  React.useEffect(() => {
    hook_edit_json_fn.set_current_form(hook_current_value);
  }, [hook_current_value]);

  React.useEffect(() => {
    hook_select_fn.update(hook_protocol_forms, hook_current_form.id);
  }, [hook_protocol_forms]);

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
          value={hook_selected_option}
          placeholder="Select form..."
          onChange={hook_select_fn.on_change}
          options={hook_select_options}
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
