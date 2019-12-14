import React from "react";

import WindowsList from "./windows_list/index";
import SyncButton from "./sync_button";

function Navigation(props) {
  return (
    <div id="main-window-bar_1" className="main-window-bar">
      <WindowsList />
      <SyncButton />
    </div>
  );
}

export default Navigation;
