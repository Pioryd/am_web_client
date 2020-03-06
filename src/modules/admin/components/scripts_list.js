import React from "react";
import { ProtocolContext } from "../../../context/protocol";
import Util from "../../../framework/util";
function ScriptsList() {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_buttons, set_state_buttons] = React.useState([]);
  const [state_last_sync, set_state_last_sync] = React.useState("");

  React.useEffect(() => {
    const packets = context_packets_fn.pop("scripts_list");
    if (packets.length === 0) return;

    const { scripts_list } = packets.pop();
    if (!Array.isArray(scripts_list)) {
      console.log("Not array", scripts_list);
      return;
    }

    let buttons_list = [];
    for (const script_name of scripts_list) {
      buttons_list.push(
        <button
          key={script_name}
          onClick={() => {
            context_packets_fn.send("process_script", { script: script_name });
          }}
        >
          {script_name}
        </button>
      );
    }
    set_state_buttons(buttons_list);
    set_state_last_sync(Util.get_time_hms());
  }, [context_packets_data]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          <button
            key="admin_send_scripts_list_button"
            className="process"
            onClick={e => {
              context_packets_fn.send("scripts_list");
            }}
          >
            sync
          </button>
          <label key="admin_send_scripts_list_label">
            {"last sync: " + state_last_sync}
          </label>
        </div>
        <div>{state_buttons}</div>
      </div>
    </React.Fragment>
  );
}

export default ScriptsList;
