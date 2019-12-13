import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../../../context/app";

function Statistics() {
  const {
    context_source,
    context_change_position,
    context_change_land,
    context_add_friend
  } = React.useContext(AppContext);
  const [state_source, set_state_source] = React.useState("");

  const onDeltaUpdate = delta => {
    const { type, keyPath, deep, key, newValue } = delta;
    const character_id = 0; // const for testing needs only
    if (key === "x") context_change_position(character_id, newValue);
    if (key === "land_id") context_change_land(character_id, newValue);
    if (keyPath.includes("friends_list"))
      context_add_friend(character_id, newValue);
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
        <JsonTree
          data={state_source}
          rootName={"hello"}
          onDeltaUpdate={onDeltaUpdate}
        />
      </div>
    </React.Fragment>
  );
}

export default Statistics;
