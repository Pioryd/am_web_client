import React from "react";
import Select from "react-select";
import Editor from "./editor";
import FormattedLogs from "../formatted_logs";

import useProtocolHook from "./protocol_hook";
import useSelectHook from "../../../../hooks/select_hook";
import ModuleWindow from "../../../../components/module_window";

import "./index.css";

function AmEditor(props) {
  const {
    hook_protocol_objects_list,
    hook_protocol_rules,
    hook_protocol_action_id,
    hook_protocol_fn
  } = useProtocolHook({
    ext_name: props.protocol_ext_name,
    object_to_source: props.object_to_source,
    log: (message) => {
      hook_formatted_logs_fn.add({
        type: "Protocol",
        text: message
      });
    }
  });

  const {
    hook_select_current_value,
    hook_select_options,
    hook_select_selected_option,
    hook_select_fn
  } = useSelectHook({
    default_value: "",
    create_label: props.create_label
  });

  const {
    hook_formatted_logs,
    hook_formatted_logs_fn
  } = FormattedLogs.useHandler();

  const [state_current_object, set_state_current_object] = React.useState("");
  const [state_new_id, set_state_new_id] = React.useState("");

  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_source_changed, set_state_source_changed] = React.useState("");

  const update_current_object = (source) => {
    if (source == null || source === "") return;

    try {
      set_state_current_object(
        props.parse(source, hook_protocol_rules, hook_select_current_value)
      );
    } catch (e) {
      hook_formatted_logs_fn.add({
        type: "Editor",
        text: `Unable to parse. Error: ${e.message}`
      });
      throw e;
    }
  };

  const button = {
    refresh() {
      hook_protocol_fn.get();
      set_state_source_changed(false);
    },
    new() {
      hook_protocol_fn.new(state_new_id);
      set_state_new_id("");
    },
    save() {
      if (state_draft_mode) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: "Unable to save. Source is in draft mode."
        });
      } else {
        hook_protocol_fn.save(state_current_object);
      }
      set_state_source_changed(false);
    },
    remove() {
      if (Object.keys(hook_select_current_value).length === 0) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: "Unable to remove. No option selected."
        });
      } else {
        hook_protocol_fn.remove(state_current_object);
      }
      set_state_source_changed(false);
    },
    process() {
      if (Object.keys(hook_select_current_value).length === 0) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: "Unable to process. No option selected."
        });
      } else {
        hook_protocol_fn.process(state_current_object);
      }
    },
    replace_id() {
      if (Object.keys(hook_select_current_value).length === 0) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: "Unable to replace id. No option selected."
        });
      } else if (state_new_id === "") {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: "Unable to replace id. No new_id provided."
        });
      } else {
        hook_protocol_fn.replace_id(state_current_object.id, state_new_id);
        set_state_new_id("");
      }
    },
    clear_logs() {
      hook_formatted_logs_fn.clear();
    }
  };

  const reset = () => {
    set_state_new_id("");
    set_state_current_object("");
    hook_select_fn.update([]);
    hook_formatted_logs_fn.clear();
    hook_protocol_fn.get();
  };

  React.useEffect(() => {
    set_state_source_changed(false);

    let current_label = null;
    for (const object of hook_protocol_objects_list)
      if (object.id === state_current_object.id)
        current_label = props.create_label(object);

    hook_select_fn.update(hook_protocol_objects_list, current_label);
  }, [hook_protocol_objects_list]);

  React.useEffect(() => set_state_source_changed(true), [state_draft_mode]);

  React.useEffect(() => set_state_current_object(hook_select_current_value), [
    hook_select_current_value
  ]);

  React.useEffect(reset, [props.protocol_ext_name]);

  return (
    <ModuleWindow
      bar={
        <React.Fragment>
          <label>Actions:</label>
          <button onClick={button.refresh}>refresh</button>
          <button onClick={button.new}>new</button>
          <button onClick={button.save}>save</button>
          <button onClick={button.remove}>remove</button>
          <button onClick={button.process}>process</button>
          <button onClick={button.replace_id}>replace id</button>
          <label>New ID:</label>
          <input
            key="new_id"
            name="new_id"
            type="text"
            value={state_new_id}
            onChange={(e) => set_state_new_id(e.target.value)}
          />
          <button onClick={button.clear_logs}>clear logs</button>

          <Select
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 9999 })
            }}
            value={hook_select_selected_option}
            placeholder={`Select script data... [${
              Object.keys(hook_select_options).length
            }]`}
            onChange={hook_select_fn.on_change}
            options={hook_select_options}
            isClearable={true}
            menuPortalTarget={document.body}
            maxMenuHeight={150}
          />
          <FormattedLogs.List
            hook_formatted_logs={hook_formatted_logs}
            hook_formatted_logs_fn={hook_formatted_logs_fn}
          />
        </React.Fragment>
      }
      content={
        <React.Fragment>
          {hook_protocol_action_id !== "" ? (
            <div className="E5m_error_box">
              <label>
                Waiting for the end of the action[{hook_protocol_action_id}]
              </label>
              <button onClick={() => hook_protocol_fn.cancel_action()}>
                cancel action
              </button>
            </div>
          ) : (
            Object.keys(hook_select_current_value).length > 0 && (
              <React.Fragment>
                {state_source_changed === true &&
                  hook_select_selected_option !== "" &&
                  state_draft_mode === false && (
                    <div className="mU9_bar">
                      <label style={{ color: "red" }}>
                        Save to apply changes
                      </label>
                    </div>
                  )}
                <Editor
                  ace_modes={props.editor_options.modes}
                  init={{
                    source: props.object_to_source(hook_select_current_value),
                    ace_mode: props.editor_options.default_mode
                  }}
                  on_validate={update_current_object}
                  on_change_draft_mode={set_state_draft_mode}
                  format={props.format}
                />
              </React.Fragment>
            )
          )}
        </React.Fragment>
      }
    />
  );
}

export default AmEditor;
