import React from "react";
import Select from "react-select";
import Editor from "./editor";
import FormattedLogs from "../formatted_logs";

import useProtocolHook from "./protocol_hook";
import useSelectHook from "../../../../hooks/select_hook";

function AmEditor(props) {
  const {
    hook_protocol_objects,
    hook_protocol_rules,
    hook_protocol_action_id,
    hook_protocol_fn
  } = useProtocolHook({
    ext_name: props.protocol_ext_name,
    log: message => {
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

  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_source_changed, set_state_source_changed] = React.useState("");

  const validate = source => {
    try {
      props.parse(source, hook_protocol_rules);
      return true;
    } catch (e) {
      hook_formatted_logs_fn.add({
        type: "Validator",
        text: e
      });
      return false;
    }
  };

  const update_current_object = source => {
    if (source == null || source === "") return;

    try {
      set_state_current_object(props.parse(source));
    } catch (e) {
      hook_formatted_logs_fn.add({
        type: "Editor",
        text: `Unable to parse. Error: ${e.message}`
      });
    }
  };

  const button = {
    refresh: () => hook_protocol_fn.get(),
    new: () => hook_protocol_fn.new(),
    save: () => {
      if (state_draft_mode) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: "Unable to save. Source is in draft mode."
        });
      } else {
        hook_protocol_fn.save(state_current_object);
      }
    },
    remove: () => {
      if (state_draft_mode) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: "Unable to remove. Source is in draft mode."
        });
      } else {
        hook_protocol_fn.remove(state_current_object);
      }
    }
  };

  React.useEffect(() => {
    set_state_source_changed(false);
    hook_select_fn.update(hook_protocol_objects, state_current_object.id);
  }, [hook_protocol_objects]);

  React.useEffect(() => set_state_source_changed(true), [state_draft_mode]);

  return (
    <div className="content_body">
      <div className="bar">
        <label>Actions:</label>
        <button onClick={button.refresh}>refresh</button>
        <button onClick={button.new}>new</button>
        <button onClick={button.save}>save</button>
        <button onClick={button.remove}>remove</button>
      </div>
      <Select
        styles={{
          // Fixes the overlapping problem of the component
          menu: provided => ({ ...provided, zIndex: 9999 })
        }}
        value={hook_select_selected_option}
        placeholder="Select script data..."
        onChange={hook_select_fn.on_change}
        options={hook_select_options}
        isClearable={true}
      />
      <FormattedLogs.List
        hook_formatted_logs={hook_formatted_logs}
        hook_formatted_logs_fn={hook_formatted_logs_fn}
      />
      <div className="am_source_editor">
        {state_source_changed === true && hook_select_selected_option !== "" && (
          <div className="bar">
            <label style={{ color: "red" }}>Save to apply changes</label>
          </div>
        )}
        {hook_protocol_action_id !== "" ? (
          <React.Fragment>
            <p>{`Waiting for the end of the action[${hook_protocol_action_id}]`}</p>
            <button onClick={() => hook_protocol_fn.cancel_action()}>
              cancel action
            </button>
          </React.Fragment>
        ) : (
          <Editor
            ace_modes={props.editor_options.modes}
            init={{
              source:
                hook_select_current_value.source ||
                props.editor_options.default_source,
              ace_mode: props.editor_options.default_mode
            }}
            on_validate={update_current_object}
            on_change_draft_mode={set_state_draft_mode}
            format={props.format}
          />
        )}
      </div>
    </div>
  );
}

export default AmEditor;
