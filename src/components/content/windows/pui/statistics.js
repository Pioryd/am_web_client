import React from "react";
import ReactJson from "react-json-view";
import { AppContext } from "../../../../context/app";

function Statistics() {
  const {
    context_admin,
    context_data_full,
    context_data_character,
    context_data_world
  } = React.useContext(AppContext);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        {context_admin ? (
          <React.Fragment>
            <ReactJson
              name="context_data_full"
              src={context_data_full}
              theme="monokai"
              indentWidth={2}
              collapsed={true}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ReactJson
              name="context_data_character"
              src={context_data_character}
              theme="monokai"
              indentWidth={2}
              collapsed={true}
            />
            <ReactJson
              name="context_data_world"
              src={context_data_world}
              theme="monokai"
              indentWidth={2}
              collapsed={true}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

export default Statistics;
