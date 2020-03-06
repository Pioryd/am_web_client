import React from "react";
import { ProtocolContext } from "../context/protocol";

function RunScript() {
  const { context_packets_fn } = React.useContext(ProtocolContext);

  const ref_text_input = React.useRef();

  const execute_script = () => {
    context_packets_fn.send("process_script", {
      script: ref_text_input.current.value
    });
    ref_text_input.current.value = "";
  };
  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          <button className="process" onClick={execute_script}>
            execute
          </button>
        </div>
        <textarea
          style={{ width: "100%", height: "100%" }}
          key="script_to_execute"
          ref={ref_text_input}
        />
      </div>
    </React.Fragment>
  );
}

export default RunScript;
