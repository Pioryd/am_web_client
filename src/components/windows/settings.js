import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../context/app";

import "./index.css";

function Settings() {
  const { context_app_data, context_app_fn } = React.useContext(AppContext);
  const [state_settings, set_state_settings] = React.useState({});

  React.useEffect(() => {
    if (context_app_data != null) set_state_settings(context_app_data);
  }, [context_app_data]);

  return (
    <React.Fragment>
      <div className="bar">Click value to edit</div>
      <div className="content_body">
        <JsonTree
          rootName="state_settings"
          data={state_settings}
          onFullyUpdate={context_app_fn.update_session}
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
