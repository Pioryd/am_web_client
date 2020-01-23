import React from "react";

import { AppContext } from "../../context/app";

import WindowsList from "./windows_list/index";
import SyncButton from "./sync_button";

import "./index.css";

function Navigation(props) {
  const { context_settings } = React.useContext(AppContext);

  return (
    <div id="main-window-bar_1" className="main-window-bar">
      <WindowsList />
      <SyncButton />
      <label
        style={{ float: "right" }}
      >{`Login[${context_settings.login}]`}</label>
      <label
        style={{ float: "right" }}
      >{`Module[${context_settings.module}]`}</label>
    </div>
  );
}

export default Navigation;
