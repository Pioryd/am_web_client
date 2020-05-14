import React from "react";
import { ProtocolContext } from "../../../../context/protocol";
import Util from "../../../../framework/util";
import AceEditor from "react-ace";
import JsonData from "../json_data";
import FormattedLogs from "../formatted_logs";

import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal"
];
themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

function ServerScripts() {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const {
    hook_formatted_logs,
    hook_formatted_logs_fn
  } = FormattedLogs.useHandler();

  const [state_buttons, set_state_buttons] = React.useState([]);
  const [state_last_sync, set_state_last_sync] = React.useState("");

  const [state_script, set_state_script] = React.useState("");
  const [state_args_as_text, set_state_args_as_text] = React.useState("");

  const execute_script = () => {
    const action_id = Date.now();
    hook_formatted_logs_fn.add({
      type: "Send",
      text: `ActionId: [${action_id}]`
    });
    context_packets_fn.send("scripts_process", {
      action_id,
      command: state_script
    });
    set_state_script("");
  };

  const parse_scripts_list = (packets) => {
    if (packets.length === 0) return;

    const { scripts_data } = packets.pop();

    if (!Array.isArray(scripts_data)) {
      hook_formatted_logs_fn.add({
        type: "Parse",
        text: "Not array " + scripts_data
      });
      return;
    }

    let buttons_list = [];
    for (const script of scripts_data) {
      const { name, desc, args } = script;
      buttons_list.push(
        <button
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            height: "100%",
            border: "1px solid blue"
          }}
          key={name}
          onClick={() => {
            const action_id = Date.now();
            hook_formatted_logs_fn.add({
              type: "Send",
              text: `ActionId: [${action_id}]`
            });
            context_packets_fn.send("scripts_process", {
              action_id,
              script_name: name,
              arguments_as_string: state_args_as_text
            });
          }}
        >
          Name: {name}
          <br />
          Desc: {desc}
          <br />
          Args: {JSON.stringify(args)}
        </button>
      );
    }
    set_state_buttons(buttons_list);
    set_state_last_sync(Util.get_time_hms());
  };

  React.useEffect(() => {
    parse_scripts_list(context_packets_fn.pop("scripts_data"));
  }, [context_packets_data]);

  return (
    <React.Fragment>
      <div className="content_body">
        <FormattedLogs.List
          hook_formatted_logs={hook_formatted_logs}
          hook_formatted_logs_fn={hook_formatted_logs_fn}
        />
        <JsonData
          packet_name="scripts_process"
          auto_sync={false}
          refresh={false}
          clear={true}
        />
        <div className="bar">
          <button
            key="admin_send_scripts_list_button"
            className="process"
            onClick={(e) => context_packets_fn.send("scripts_data")}
          >
            sync
          </button>
          <label key="admin_send_scripts_list_label">
            {"last sync: " + state_last_sync}
          </label>
        </div>
        <div className="bar">
          <input
            className="input_value"
            key="interval_value"
            name="interval_value"
            type="text"
            value={state_args_as_text}
            onChange={(e) => set_state_args_as_text(e.target.value)}
          />
        </div>
        <div>{state_buttons}</div>
        <div className="bar">
          <button className="process" onClick={execute_script}>
            execute
          </button>
          <label>{"(app, args) => { <script> }"}</label>
        </div>
        <AceEditor
          height={"100%"}
          width={"100%"}
          mode={"javascript"}
          theme={"textmate"}
          name="editor_name"
          onChange={(new_script) => set_state_script(new_script)}
          value={state_script}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          //setOptions={{}}
        />
      </div>
    </React.Fragment>
  );
}

export default ServerScripts;
