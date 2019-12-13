import React from "react";
import { JSONViewer, JSONEditor } from "react-json-editor-viewer";
import { AppContext } from "../../../../context/app";

function PUI() {
  const {
    context_source,
    context_change_position,
    context_change_land
  } = React.useContext(AppContext);
  const [state_source, set_state_source] = React.useState("");

  const onJsonChange = (key, value, parent, data) => {
    if (key === "position") context_change_position(value);
    if (key === "land_id") context_change_land(value);
  };

  React.useEffect(() => {
    if (context_source !== undefined && "command" in context_source) {
      set_state_source(context_source);
    }
  }, [context_source]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar"></div>
        <JSONViewer data={state_source} collapsible view="dual" />
        <JSONEditor
          data={state_source}
          collapsible
          onChange={onJsonChange}
          view="dual"
        />
      </div>
    </React.Fragment>
  );
}

export default PUI;
