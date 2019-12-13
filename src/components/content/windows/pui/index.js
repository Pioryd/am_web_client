import React from "react";
import { JSONEditor } from "react-json-editor-viewer";
import { AppContext } from "../../../../context/app";

function PUI() {
  const {
    context_source,
    context_change_position,
    context_change_land
  } = React.useContext(AppContext);
  const [state_source, set_state_source] = React.useState("");

  const onJsonChange = (key, value, parent, data) => {
    const character_id = 0; // const for testing needs only
    if (key === "x") context_change_position(character_id, value);
    if (key === "land_id") context_change_land(character_id, value);
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
