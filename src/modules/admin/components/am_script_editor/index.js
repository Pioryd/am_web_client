import React from "react";
import Select from "react-select";
import JsonEditor from "./editor";
import FormattedLogs from "../formatted_logs";

import useValidate from "./validate_hook";
import useProtocolHook from "./protocol_hook";
import useSelectHook from "./select_hook";

const note_after_action_processed =
  "remember to check the data after action being processed.";
const CONSOLE_LOGS_HEIGHT = "100px";

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

  const [state_logs_height, set_state_logs_height] = React.useState(
    CONSOLE_LOGS_HEIGHT
  );

  const button = {
    refresh: () => {
      let error = "Unable to create.";

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

      hook_protocol_fn.get(object);
      hook_formatted_logs_fn.add({
        type: "Action",
        text: note_after_action_processed
      });
      hook_validate_fn.clear_last_error();
    },
    new: () => {
      hook_protocol_fn.new();
      hook_formatted_logs_fn.add({
        type: "Action",
        text: note_after_action_processed
      });
      hook_validate_fn.clear_last_error();
    },
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
        hook_formatted_logs_fn.add({
          type: "Action",
          text: note_after_action_processed
        });
        hook_validate_fn.clear_last_error();
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
        hook_formatted_logs_fn.add({
          type: "Action",
          text: note_after_action_processed
        });
        hook_validate_fn.clear_last_error();
      }
    },
    clear_log: () => hook_formatted_logs_fn.clear(),
    resize_logs: () => {
      let logs_height = state_logs_height;
      if (logs_height === CONSOLE_LOGS_HEIGHT) logs_height = "100%";
      else logs_height = CONSOLE_LOGS_HEIGHT;

      set_state_logs_height(logs_height);
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
    hook_select_fn.update(hook_protocol_json_data, state_current_json.id);
  }, [hook_protocol_json_data]);

  React.useEffect(() => set_state_json_changed(true), [state_draft_mode]);

  React.useEffect(() => {
    hook_validate_fn.set_rules(hook_protocol_json_rules);
  }, [hook_protocol_json_rules]);

  return (
    <div className="content_body">
      <div className="bar">
        <button onClick={button.refresh}>refresh</button>
        <button onClick={button.new}>new</button>
        <button onClick={button.save}>save</button>
        <button onClick={button.remove}>remove</button>
        <button onClick={button.clear_log}>clear log</button>
        <button onClick={button.resize_logs}>resize logs</button>
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
      <div
        className="bar"
        style={{ height: state_logs_height, overflow: "auto" }}
      >
        <FormattedLogs.List logs={hook_formatted_logs} />
      </div>
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
