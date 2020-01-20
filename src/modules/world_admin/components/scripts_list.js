import React from "react";
import { AppContext } from "../../../context/app";
import Util from "../../../framework/util";
function ScriptsList() {
  const {
    context_admin_send_scripts_list,
    context_admin_send_process_script,
    context_admin_scripts_list
  } = React.useContext(AppContext);

  const [state_buttons, set_state_buttons] = React.useState([]);
  const [state_last_sync, set_state_last_sync] = React.useState("");

  React.useEffect(() => {
    const { scripts_list } = context_admin_scripts_list;
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
            context_admin_send_process_script({ script: script_name });
          }}
        >
          {script_name}
        </button>
      );
    }
    set_state_buttons(buttons_list);
    set_state_last_sync(Util.get_time_hms());
  }, [context_admin_scripts_list]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          <button
            key="admin_send_scripts_list_button"
            className="process"
            onClick={e => {
              context_admin_send_scripts_list();
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
