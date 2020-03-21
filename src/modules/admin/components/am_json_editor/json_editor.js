import React from "react";
import AceEditor from "react-ace";

import Util from "../../../../framework/util";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

import "./index.css";

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal"
];
themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

const mode = "json";
const parse_modes = ["javascript", "json"];

function JsonEditor(props) {
  const [state_json, set_state_json] = React.useState("");
  const [state_draft_mode, set_state_draft_mode] = React.useState(true);
  const [state_last_log, set_state_last_log] = React.useState("");

  const [state_theme, set_state_theme] = React.useState("monokai");
  const [state_parse_mode, set_state_parse_mode] = React.useState("javascript");

  const [state_font_size, set_state_font_size] = React.useState(14);
  const [state_show_gutter, set_state_show_gutter] = React.useState(true);
  const [state_show_print_margin, set_state_show_print_margin] = React.useState(
    true
  );
  const [
    state_highlight_active_line,
    set_state_highlight_active_line
  ] = React.useState(true);

  const [state_show_line_numbers, set_state_show_line_numbers] = React.useState(
    true
  );
  const [state_tab_size, set_state_tab_size] = React.useState(2);
  const [state_options, set_state_options] = React.useState({});

  const to_json = object => {
    return JSON.stringify(object, null, state_tab_size);
  };

  const update_last_log = message => {
    if (message === "") set_state_last_log("");
    else
      set_state_last_log(
        `[${Util.get_time_hms()}] ${message} >> After fix, press [ctrl + s] again`
      );
  };

  const parse = new_value => {
    try {
      let object = null;
      let json = "";
      if (state_parse_mode === "javascript") eval("object=" + new_value);
      else object = JSON.parse(new_value);

      json = to_json(object);

      set_state_json(json);
      set_state_draft_mode(false);

      if (props.on_parse) props.on_parse(json);
    } catch (e) {
      console.log(e);
      update_last_log("Unable to parse JSON source.");
    }
  };

  const on_key_down = event => {
    let charCode = String.fromCharCode(event.which).toLowerCase();

    // ctrl + s
    if (event.ctrlKey && charCode === "s") {
      event.preventDefault();
      parse(state_json);
    }
  };

  const on_change = new_json => {
    set_state_json(new_json);
    set_state_draft_mode(true);
  };

  React.useEffect(() => {
    set_state_options({
      useWorker: false,
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      enableSnippets: false,
      showLineNumbers: state_show_line_numbers,
      tabSize: state_tab_size
    });
  }, [state_show_line_numbers, state_tab_size]);

  React.useEffect(() => {
    let json = "";
    try {
      json = to_json(props.init_object);
    } catch {
      update_last_log("Wrong init json source");
    }

    parse(json);
  }, [props.init_object]);

  React.useEffect(() => {
    if (props.on_change_draft_mode)
      props.on_change_draft_mode(state_draft_mode);
  }, [state_draft_mode]);

  return (
    <div className="json_editor" onKeyDown={on_key_down}>
      <div className="bar">
        <div className="element">
          <label>Show gutter:</label>
          <input
            name="show gutter"
            type="checkbox"
            checked={state_show_gutter}
            onChange={e => set_state_show_gutter(e.target.checked)}
          />
        </div>
        <div className="element">
          <label>Show print margin:</label>
          <input
            name="show print margin"
            type="checkbox"
            checked={state_show_print_margin}
            onChange={e => set_state_show_print_margin(e.target.checked)}
          />
        </div>
        <div className="element">
          <label>Highlight active line:</label>
          <input
            name="highlight active line"
            type="checkbox"
            checked={state_highlight_active_line}
            onChange={e => set_state_highlight_active_line(e.target.checked)}
          />
        </div>
        <div className="element">
          <label>Show line numbers:</label>
          <input
            name="show line numbers"
            type="checkbox"
            checked={state_show_line_numbers}
            onChange={e => set_state_show_line_numbers(e.target.checked)}
          />
        </div>
        <div className="element">
          <label>Font size:</label>
          <input
            className="input_value"
            key="font size"
            name="font size"
            type="number"
            value={state_font_size}
            min={1}
            max={30}
            step={1}
            onChange={e => {
              const value = e.target.value;
              if (value >= 1 && value <= 30)
                set_state_font_size(parseInt(value));
            }}
          />
        </div>
        <div className="element">
          <label>Tab size:</label>
          <input
            className="input_value"
            key="tab size"
            name="tab size"
            type="number"
            value={state_tab_size}
            min={1}
            max={30}
            step={1}
            onChange={e => {
              const value = e.target.value;
              if (value >= 1 && value <= 30)
                set_state_tab_size(parseInt(value));
            }}
          />
        </div>
        <div className="element">
          <label>Theme:</label>
          <select
            name="Theme"
            onChange={e => set_state_theme(e.target.value)}
            value={state_theme}
          >
            {themes.map(theme => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        <div className="element">
          <label>Parse mode(ctrl + s):</label>
          <select
            name="parse_mode"
            onChange={e => set_state_parse_mode(e.target.value)}
            value={state_parse_mode}
          >
            {parse_modes.map(mode => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state_draft_mode === true && (
        <div className="bar" style={{ color: "red" }}>
          Editor: (Draft mode). To leave draft mode press [ctrl + s].
        </div>
      )}
      {state_last_log !== "" && (
        <div className="bar">Editor: {state_last_log}</div>
      )}
      <div className="am_json_editor">
        <AceEditor
          height={"100%"}
          width={"100%"}
          mode={mode}
          theme={state_theme}
          name="editor_name"
          onChange={on_change}
          value={state_json}
          fontSize={state_font_size}
          showPrintMargin={state_show_print_margin}
          showGutter={state_show_gutter}
          highlightActiveLine={state_highlight_active_line}
          setOptions={state_options}
        />
      </div>
    </div>
  );
}

export default JsonEditor;
