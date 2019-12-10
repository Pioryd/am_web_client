import React from "react";

import WindowsList from "./windows_list/index";
import SyncButton from "./sync_button";
import IntervalInput from "./interval_input";

function Navigation(props) {
  return (
    <div id="main-window-bar_1" className="main-window-bar">
      <WindowsList />
      <SyncButton />
      <IntervalInput />
    </div>
  );
}

export default Navigation;
