import React from "react";
import Tooltip from "rc-tooltip";

import { AppContext } from "../../context/app";

import WindowsList from "./windows_list/index";
import SyncButton from "./sync_button";

import "rc-tooltip/assets/bootstrap_white.css";
import "./index.css";

function Navigation(props) {
  const { context_settings } = React.useContext(AppContext);

  return (
    <div id="main-window-bar_1" className="main-window-bar">
      <WindowsList />
      <SyncButton />
      <Tooltip
        placement="bottom"
        trigger={["click"]}
        overlay={
          <React.Fragment>
            <span>{`Login[${context_settings.accept_connection_data.login}]`}</span>
            <br />
            <span>{`Module[${context_settings.module}]`}</span>
          </React.Fragment>
        }
      >
        <button style={{ float: "right" }}>Info(?)</button>
      </Tooltip>
    </div>
  );
}

export default Navigation;
