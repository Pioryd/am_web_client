import React from "react";
import Select from "react-select";
import { JsonTree } from "react-editable-json-tree";
import Util from "../../../../framework/util";
import { ProtocolContext } from "../../../../context/protocol";
import useEditJson from "./edit_json_hook";

function FormEditor() {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const {
    hook_last_message,
    hook_current_form,
    hook_data_changed,
    hook_edit_json_fn
  } = useEditJson();

  const [state_action_id, set_state_action_id] = React.useState("");

  const [state_options, set_state_options] = React.useState([]);
  const [state_selected_option, set_state_selected_option] = React.useState("");

  const [state_last_message, set_state_last_message] = React.useState("");

  const update_last_message = message => {
    set_state_last_message(`"[${Util.get_time_hms()}] ${message}"`);
  };

  const can_perform_action = () => {
    if (state_action_id !== "") {
      update_last_message(
        "You cannot perform action. Util last one will done."
      );
      return false;
    }
    return true;
  };

  const get_forms = () => {
    if (can_perform_action() === false) return;

    const action_id = Date.now();

    context_packets_fn.send("data_am_form", { action_id });
    set_state_action_id(action_id);
  };

  const new_form = () => {
    if (can_perform_action() === false) return;

    const action_id = Date.now();

    context_packets_fn.send("update_am_form", {
      action_id,
      id: "",
      object: null
    });

    get_forms();
  };

  const save_form = () => {
    if (can_perform_action() === false) return;
    if (!("id" in hook_current_form)) return;

    const action_id = Date.now();

    context_packets_fn.send("update_am_form", {
      action_id,
      id: hook_current_form.id,
      object: hook_current_form
    });

    get_forms();
  };

  const remove_form = () => {
    if (can_perform_action() === false) return;
    if (!("id" in hook_current_form)) return;

    const action_id = Date.now();

    context_packets_fn.send("update_am_form", {
      action_id,
      id: hook_current_form.id,
      object: null
    });

    get_forms();
  };

  // Handle select
  React.useEffect(() => {
    const options = state_options;
    const label = state_selected_option.label;

    let form = {};
    for (const option of options) {
      if (option.label === label) form = option.value;
    }

    update_last_message(
      `Changed from[${hook_current_form.name}] to[${form.name}]`
    );
    hook_edit_json_fn.set_current_form(form);
  }, [state_selected_option]);

  // Parse packet
  React.useEffect(() => {
    const data_am_form = context_packets_fn.pop("data_am_form");

    if (state_action_id === "") return;

    let options = null;
    let current_form = null;
    let action_id = null; // For searching needs
    let selected_option = null;

    // Search for action_id
    for (const data of data_am_form) {
      if (data.action_id === state_action_id) {
        options = [];
        current_form = {};
        action_id = state_action_id;
        selected_option = "";

        for (const form of Object.values(data.forms))
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

        break;
      }
    }

    if (options != null) set_state_options(options);
    if (current_form != null) hook_edit_json_fn.set_current_form(current_form);
    if (action_id != null) set_state_action_id("");
    if (selected_option != null) set_state_selected_option(selected_option);
  }, [context_packets_data]);

  return (
    <div className="content_body">
      <div className="bar">
        <button onClick={get_forms}>refresh</button>
        <button onClick={new_form}>new</button>
        <button onClick={save_form}>save</button>
        <button onClick={remove_form}>remove</button>
      </div>
      <div className="bar">
        <label>{state_last_message}</label>
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
        <label>{hook_last_message}</label>
      </div>
      <div className="form_editor">
        {hook_data_changed === true && (
          <div className="bar">
            <label style={{ color: "red" }}>Save to apply changes</label>
          </div>
        )}
        {state_action_id !== "" ? (
          <React.Fragment>
            <p>Waiting for the end of the action</p>
            <button>cancel action</button>
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
