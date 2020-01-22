import React from "react";
import ReactJson from "react-json-view";
import { ProtocolContext } from "../context/protocol";

function ModuleData() {
  const { context_send_module_data, context_module_data } = React.useContext(
    ProtocolContext
  );

  const [state_module_data, set_state_module_data] = React.useState({});

  const refresh_module_data = () => {
    context_send_module_data();
  };

  React.useEffect(() => {
    set_state_module_data(context_module_data);
  }, [context_module_data]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          {" "}
          <button className="process" onClick={refresh_module_data}>
            refresh
          </button>
        </div>
        <ReactJson
          name="ModuleData"
          src={state_module_data}
          theme="monokai"
          indentWidth={2}
          collapsed={true}
        />
      </div>
    </React.Fragment>
  );
}

export default ModuleData;
