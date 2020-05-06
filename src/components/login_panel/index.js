import React from "react";

import EditForm from "./edit_form";
import EditJson from "./edit_json";

import "./index.css";

function LoginPanel(props) {
  const [state_mode, set_state_mode] = React.useState("json");

  const toggle_mode = () => {
    set_state_mode(state_mode === "form" ? "json" : "form");
  };

  return (
    <div className="login-panel">
      <p>(Artificial Mind) - Web Client</p>
      <button className="switch_button" onClick={toggle_mode}>
        {state_mode === "form" && "Switch to JSON editor"}
        {state_mode === "json" && "Switch to FORM editor"}
      </button>
      {state_mode === "form" && <EditForm />}
      {state_mode === "json" && <EditJson />}
    </div>
  );
}

export default LoginPanel;
