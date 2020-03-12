import React from "react";
import Select from "react-select";
import JsonEditor from "./json_editor";
import Util from "../../../../framework/util";

import useValidate from "./validate_hook";
import useProtocolHook from "./protocol_hook";
import useSelectHook from "./select_hook";

function AmEditor(props) {
  const { hook_validate_last_error, hook_validate } = useValidate({
    mode: props.mode
  });

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

  const [state_current_json, set_state_current_json] = React.useState("");
  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_last_log, set_state_last_log] = React.useState("");
  const [state_json_changed, set_state_json_changed] = React.useState("");

  const update_last_log = message => {
    if (message === "") set_state_last_log("");
    else set_state_last_log(`"[${Util.get_time_hms()}] ${message}"`);
  };

  const button = {
    refresh: () => {
      let error = "Unable to create.";

      let object = null;

      try {
        object = JSON.parse(state_current_json);
      } catch (e) {
        console.log(e);
        update_last_log(error + " Wrong object format.");
        return;
      }

      hook_protocol_fn.get(object);
      update_last_log("");
    },
    new: () => {
      hook_protocol_fn.new();
      update_last_log("");
    },
    save: () => {
      let error = "Unable to save.";

      let object = null;

      try {
        object = JSON.parse(state_current_json);
      } catch (e) {
        console.log(e);
        update_last_log(error + " Wrong object format.");
        return;
      }

      if (state_draft_mode) {
        update_last_log(error + " Source is in draft mode.");
      } else if (!hook_validate(object)) {
        update_last_log(error + " Validate fail.");
      } else {
        hook_protocol_fn.save(object);
        update_last_log("");
      }
    },
    remove: () => {
      let error = "Unable to remove.";
      let object = null;

      try {
        object = JSON.parse(state_current_json);
      } catch (e) {
        console.log(e);
        update_last_log(error + " Wrong object format.");
        return;
      }

      if (state_draft_mode) {
        update_last_log(error + " Source is in draft mode.");
      } else if (!hook_validate(object)) {
        update_last_log(error + " Validate fail.");
      } else {
        hook_protocol_fn.remove(object);
        update_last_log("");
      }
    }
  };

  React.useEffect(() => {
    set_state_json_changed(false);
    hook_select_fn.update(hook_protocol_forms, state_current_json.id);
  }, [hook_protocol_forms]);

  React.useEffect(() => {
    set_state_json_changed(true);
  }, [state_draft_mode]);

  return (
    <div className="content_body">
      <div className="bar">
        <label>Actions: {state_last_log}</label>
      </div>
      <div className="bar">
        <button onClick={button.refresh}>refresh</button>
        <button onClick={button.new}>new</button>
        <button onClick={button.save}>save</button>
        <button onClick={button.remove}>remove</button>
      </div>
      <div className="bar">
        <label>Protocol: {hook_protocol_last_log}</label>
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
        <label>Validator: {hook_validate_last_error}</label>
      </div>
      <div className="form_editor">
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
