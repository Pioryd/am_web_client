import React from "react";
import AceEditor from "react-ace";
import { AppContext } from "../../../context/app";

import "./index.css";

require(`ace-builds/src-noconflict/theme-monokai`);
require(`ace-builds/src-noconflict/mode-json`);

function EditJson(props) {
  const { context_app_fn } = React.useContext(AppContext);

  const [state_source_as_string, set_state_source_as_string] = React.useState(
    ""
  );
  const [state_error, set_state_error] = React.useState("");

  const button = {
    reload() {
      try {
        set_state_source_as_string(
          JSON.stringify(context_app_fn._get_sessions() || {}, null, 2)
        );
        set_state_error("");
      } catch (e) {
        set_state_error(JSON.stringify(e.message, null, 2));
      }
    },
    save() {
      try {
        const source_as_string = state_source_as_string.trim();

        const source_as_object =
          source_as_string === "" ? {} : JSON.parse(source_as_string);

        context_app_fn._set_sessions(source_as_object);
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
      <div className="source_editor">
        <AceEditor
          mode="json"
          theme="bright:inverted"
          name="editor_name"
          onChange={set_state_source_as_string}
          value={state_source_as_string}
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
