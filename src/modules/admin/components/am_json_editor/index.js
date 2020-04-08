import React from "react";
import Select from "react-select";
import JsonEditor from "./json_editor";
import FormattedLogs from "../formatted_logs";

import useValidate from "./validate_hook";
import useProtocolHook from "./protocol_hook";
import useSelectHook from "./select_hook";

function AmEditor(props) {
  const { hook_validate_last_error, hook_validate_fn } = useValidate({
    mode: props.mode
  });

  const {
    hook_protocol_json_data,
    hook_protocol_json_rules,
    hook_protocol_last_log,
    hook_protocol_action_id,
    hook_protocol_fn
  } = useProtocolHook({ mode: props.mode });

  const {
    hook_current_value,
    hook_select_options,
    hook_selected_option,
    hook_select_fn
  } = useSelectHook();

  const {
    hook_formatted_logs,
    hook_formatted_logs_fn
  } = FormattedLogs.useHandler();

  const [state_current_json, set_state_current_json] = React.useState("");
  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_json_changed, set_state_json_changed] = React.useState("");

  const button = {
    refresh: () => {
      let error = "Unable to create.";

      try {
      } catch (e) {
        console.log(e);
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Wrong object format."
        });
        return;
      }

      hook_protocol_fn.get();
    },
    new: () => hook_protocol_fn.new(),
    save: () => {
      let error = "Unable to save.";

      let object = null;

      try {
        object = JSON.parse(state_current_json);
      } catch (e) {
        console.log(e);
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Wrong object format."
        });
        return;
      }

      if (state_draft_mode) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Source is in draft mode."
        });
      } else if (!hook_validate_fn.validate(object)) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Validate fail."
        });
      } else {
        hook_protocol_fn.save(object);
      }
    },
    remove: () => {
      let error = "Unable to remove.";
      let object = null;

      try {
        object = JSON.parse(state_current_json);
      } catch (e) {
        console.log(e);
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Wrong object format."
        });
        return;
      }

      if (state_draft_mode) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Source is in draft mode."
        });
      } else if (!hook_validate_fn.validate(object)) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Validate fail."
        });
      } else {
        hook_protocol_fn.remove(object);
      }
    }
  };

  React.useEffect(() => {
    hook_formatted_logs_fn.add({
      type: "Protocol",
      text: hook_protocol_last_log
    });
  }, [hook_protocol_last_log]);

  React.useEffect(() => {
    hook_formatted_logs_fn.add({
      type: "Validator",
      text: hook_validate_last_error
    });
  }, [hook_validate_last_error]);

  React.useEffect(() => {
    set_state_json_changed(false);

    if (Object.keys(hook_protocol_json_data).length === 0) return;

    let label = null;
    try {
      const { id } = JSON.parse(state_current_json);
      label = id;
    } catch (e) {
      hook_formatted_logs_fn.add({
        type: "Select",
        text: "Unable to find data with previously selected id."
      });
    }

    hook_select_fn.update(hook_protocol_json_data, label);
  }, [hook_protocol_json_data]);

  React.useEffect(() => set_state_json_changed(true), [state_draft_mode]);

  React.useEffect(() => {
    hook_validate_fn.set_rules(hook_protocol_json_rules);
  }, [hook_protocol_json_rules]);

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
        value={hook_selected_option}
        placeholder="Select json data..."
        onChange={hook_select_fn.on_change}
        options={hook_select_options}
      />
      <FormattedLogs.List
        hook_formatted_logs={hook_formatted_logs}
        hook_formatted_logs_fn={hook_formatted_logs_fn}
      />
      <div className="am_json_editor">
        {state_json_changed === true && hook_selected_option !== "" && (
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
          <JsonEditor
            init_object={hook_current_value}
            on_parse={set_state_current_json}
            on_change_draft_mode={set_state_draft_mode}
          />
        )}
      </div>
    </div>
  );
}

export default AmEditor;
