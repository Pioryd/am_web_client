import React from "react";
import AceEditor from "react-ace";
import Ajv from "ajv";
import Util from "../../../framework/util";

import rules from "./rules";

import "./index.css";

require(`ace-builds/src-noconflict/theme-monokai`);
require(`ace-builds/src-noconflict/mode-json`);

function EditJson(props) {
  const [state_source, set_state_source] = React.useState("");
  const [state_error, set_state_error] = React.useState("");

  const button = {
    reload() {
      try {
        set_state_source(
          JSON.stringify(
            JSON.parse(localStorage.getItem("am_login_data") || "{}"),
            null,
            2
          )
        );
        set_state_error("");
      } catch (e) {
        set_state_error(JSON.stringify(e.message, null, 2));
      }
    },
    save() {
      try {
        const data_map = JSON.parse(state_source);
        for (const value of Object.values(data_map)) {
          const ajv = new Ajv({ allErrors: true });
          const validate = ajv.compile(rules);
          const valid = validate(Util.shallow_copy(value));
          if (!valid)
            throw new Error(
              "AJV:" +
                ajv.errorsText(validate.errors) +
                ` of object\n${JSON.stringify(value, null, 2)}`
            );
        }

        localStorage.setItem("am_login_data", JSON.stringify(data_map));
        set_state_error("");
      } catch (e) {
        set_state_error(e.message);
      }
    }
  };

  React.useEffect(() => button.reload(), []);

  return (
    <React.Fragment>
      <div className="buttons">
        <button onClick={button.reload}>Reload</button>
        <button onClick={button.save}>Save</button>
      </div>
      <span className="error_text">
        {state_error !== "" && "Error. Check log below."}
      </span>
      <div className="buttons"></div>
      <div className="source_editor">
        <AceEditor
          mode="json"
          theme="bright:inverted"
          name="editor_name"
          onChange={set_state_source}
          value={state_source}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      </div>
      <pre className="error_text">{state_error !== "" && state_error}</pre>
    </React.Fragment>
  );
}

export default EditJson;
