import React from "react";
import { AppContext } from "../../../../context/app";

function RunScript() {
  const { context_admin_send_process_script } = React.useContext(AppContext);

  const ref_text_input = React.useRef();

  const execute_script = () => {
    context_admin_send_process_script({ script: ref_text_input.current.value });
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