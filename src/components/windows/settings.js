import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../context/app";

import "./index.css";

function Settings() {
  const { context_settings, context_update_settings } = React.useContext(
    AppContext
  );
  const [state_settings, set_state_settings] = React.useState({});

  React.useEffect(() => {
    if (context_settings != null) set_state_settings(context_settings);
  }, [context_settings]);

  return (
    <React.Fragment>
      <div className="bar">Click value to edit</div>
      <div className="content_body">
        <JsonTree
          rootName="state_settings"
          data={state_settings}
          onFullyUpdate={context_update_settings}
          isCollapsed={() => {
            return false;
          }}
          cancelButtonElement={<button className="json-button">Cancel</button>}
          editButtonElement={<button className="json-button">Accept</button>}
          addButtonElement={<button className="json-button">Add</button>}
          minusMenuElement={<span />}
          plusMenuElement={<span />}
        />
      </div>
    </React.Fragment>
  );
}

export default Settings;
