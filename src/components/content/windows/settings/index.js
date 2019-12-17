import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../../../context/app";

function Settings() {
  const { context_settings, context_set_settings } = React.useContext(
    AppContext
  );
  const [state_settings, set_state_settings] = React.useState({});

  const onFullyUpdate = data => {
    context_set_settings(data);
  };

  React.useEffect(() => {
    if (context_settings !== undefined) {
      set_state_settings(context_settings);
    }
  }, [context_settings]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar"></div>
        <JsonTree
          data={state_settings}
          rootName={"settings"}
          onFullyUpdate={onFullyUpdate}
        />
      </div>
    </React.Fragment>
  );
}

export default Settings;
