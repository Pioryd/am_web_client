import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../../../context/app";

function Settings() {
  const { context_settings, context_set_settings } = React.useContext(
    AppContext
  );
  const [state_settings, set_state_settings] = React.useState({});

  const on_edit = data => {
    console.log(...data);
    context_set_settings(data);
  };

  React.useEffect(() => {
    if (context_settings != null) set_state_settings(context_settings);
  }, [context_settings]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        <JsonTree
          rootName="context_data_character"
          data={state_settings}
          onDeltaUpdate={on_edit}
          isCollapsed={() => {
            return false;
          }}
          cancelButtonElement={<button>X</button>}
          editButtonElement={<button>OK</button>}
          addButtonElement={<button>Add</button>}
          plusMenuElement={<span>Add</span>}
          minusMenuElement={<span>Remove</span>}
        />
      </div>
    </React.Fragment>
  );
}

export default Settings;
