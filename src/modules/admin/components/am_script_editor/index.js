import React from "react";
import Select from "react-select";
import Editor from "./editor";
import FormattedLogs from "../formatted_logs";

import AML from "../../../../framework/aml";

import useValidate from "./validate_hook";
import useProtocolHook from "./protocol_hook";
import useSelectHook from "./select_hook";

function AmEditor(props) {
  const { hook_validate_last_error, hook_validate_fn } = useValidate({
    mode: props.mode
  });

  const {
    hook_protocol_script_data,
    hook_protocol_script_rules,
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

  const [
    state_current_script_data,
    set_state_current_script_data
  ] = React.useState("");
  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_script_changed, set_state_script_changed] = React.useState("");

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

      try {
        AML.parse(state_current_script_data.source);
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
      } else if (!hook_validate_fn.validate(state_current_script_data.source)) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Validate fail."
        });
      } else {
        hook_protocol_fn.save(state_current_script_data.source);
      }
    },
    remove: () => {
      let error = "Unable to remove.";

      try {
        AML.parse(state_current_script_data.source);
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
      } else if (!hook_validate_fn.validate(state_current_script_data.source)) {
        hook_formatted_logs_fn.add({
          type: "Action",
          text: error + " Validate fail."
        });
      } else {
        hook_protocol_fn.remove(state_current_script_data.source);
      }
    }
  };

  const on_editor_parse = source => {
    try {
      const { id } = AML.parse(source);
      set_state_current_script_data({ id, source });
    } catch (e) {
      console.log(e);
      hook_formatted_logs_fn.add({ type: "Editor", text: "Unable to parse." });
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
    set_state_script_changed(false);
    hook_select_fn.update(
      hook_protocol_script_data,
      state_current_script_data.id
    );
  }, [hook_protocol_script_data]);

  React.useEffect(() => set_state_script_changed(true), [state_draft_mode]);

  React.useEffect(() => {
    hook_validate_fn.set_rules(hook_protocol_script_rules);
  }, [hook_protocol_script_rules]);

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
        placeholder="Select script data..."
        onChange={hook_select_fn.on_change}
        options={hook_select_options}
      />
      <FormattedLogs.List
        hook_formatted_logs={hook_formatted_logs}
        hook_formatted_logs_fn={hook_formatted_logs_fn}
      />
      <div className="am_script_editor">
        {state_script_changed === true && hook_selected_option !== "" && (
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
            init_source={hook_current_value.source || "data"}
            on_parse={on_editor_parse}
            on_change_draft_mode={set_state_draft_mode}
          />
        )}
      </div>
    </div>
  );
}

export default AmEditor;
