import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../../context/app";

import "./index.css";

function Settings() {
  const { context_app_session_data, context_app_fn } = React.useContext(
    AppContext
  );

  return (
    <div className="settings">
      <JsonTree
        rootName="session_data"
        data={context_app_session_data}
        onFullyUpdate={context_app_fn.update_session}
        isCollapsed={() => false}
        cancelButtonElement={<button className="json-button">Cancel</button>}
        editButtonElement={<button className="json-button">Accept</button>}
        addButtonElement={<button className="json-button">Add</button>}
        minusMenuElement={<span />}
        plusMenuElement={<span />}
      />
    </div>
  );
}

export default Settings;
