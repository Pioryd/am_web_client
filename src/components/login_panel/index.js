import React from "react";

import LoginEditor from "./login_editor";
import BackupRestore from "./backup_restore";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

const BASIC_VALUES = [
  "settings.name",
  "settings.module",
  "settings.description",
  "root.connection.host",
  "root.connection.port",
  "root.connection.accept_data"
];

function LoginPanel(props) {
  const [state_mode, set_state_mode] = React.useState("basic");
  const [state_login_editor_key, set_state_login_editor_key] = React.useState(
    "basic"
  );

  const change_mode = (mode) => {
    set_state_mode(mode);
    set_state_login_editor_key(uuidv4());
  };

  return (
    <div className="A8t_login-panel">
      <p>(Artificial Mind) - Web Client</p>
      <div className="A8t_main-buttons">
        <button
          className={state_mode === "basic" ? "A8t_on" : "A8t_off"}
          onClick={() => change_mode("basic")}
        >
          Basic
        </button>
        <button
          className={state_mode === "advanced" ? "A8t_on" : "A8t_off"}
          onClick={() => change_mode("advanced")}
        >
          Advanced
        </button>
        <button
          className={state_mode === "backup_restore" ? "A8t_on" : "A8t_off"}
          onClick={() => change_mode("backup_restore")}
        >
          Backup/Restore
        </button>
      </div>
      {state_mode === "basic" && (
        <LoginEditor show={BASIC_VALUES} key={state_login_editor_key} />
      )}
      {state_mode === "advanced" && (
        <LoginEditor key={state_login_editor_key} />
      )}
      {state_mode === "backup_restore" && <BackupRestore />}
    </div>
  );
}

export default LoginPanel;
