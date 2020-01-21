import React from "react";
import ReactJson from "react-json-view";
import { ProtocolContext } from "../context/protocol";

function ViewSource() {
  const {
    context_data_character,
    context_data_land,
    context_data_world
  } = React.useContext(ProtocolContext);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        <React.Fragment>
          <ReactJson
            name="CharacterData"
            src={context_data_character}
            theme="monokai"
            indentWidth={2}
            collapsed={true}
          />
          <ReactJson
            name="LandData"
            src={context_data_land}
            theme="monokai"
            indentWidth={2}
            collapsed={true}
          />
          <ReactJson
            name="WorldData"
            src={context_data_world}
            theme="monokai"
            indentWidth={2}
            collapsed={true}
          />
        </React.Fragment>
      </div>
    </React.Fragment>
  );
}

export default ViewSource;
