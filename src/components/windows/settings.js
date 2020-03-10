import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../context/app";

function Settings() {
  const { context_settings, context_set_settings } = React.useContext(
    AppContext
  );
  const [state_settings, set_state_settings] = React.useState({});

  React.useEffect(() => {
    if (context_settings != null) set_state_settings(context_settings);
  }, [context_settings]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        <JsonTree
          rootName="state_settings"
          data={state_settings}
          onFullyUpdate={data => context_set_settings({ ...data })}
          isCollapsed={() => {
            return false;
          }}
          cancelButtonElement={<button>Cancel</button>}
          editButtonElement={<button>Accept</button>}
          addButtonElement={<button>Add</button>}
          minusMenuElement={<span />}
        />
      </div>
    </React.Fragment>
  );
}

export default Settings;
