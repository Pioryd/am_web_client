import React from "react";
import AceEditor from "react-ace";

import Util from "../../../../framework/util";

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
themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

["javascript", "json", "elm", "text", "cirru", "ruby", "tcl"].forEach((mode) =>
  require(`ace-builds/src-noconflict/mode-${mode}`)
);

function Editor(props) {
  const [state_source, set_state_source] = React.useState("");
  const [state_draft_mode, set_state_draft_mode] = React.useState(true);
  const [state_last_log, set_state_last_log] = React.useState("");

  const [state_ace_theme, set_state_ace_theme] = React.useState("textmate");
  const [state_ace_mode, set_state_ace_mode] = React.useState(
    props.init.ace_mode
  );
  const [state_ace_font_size, set_state_ace_font_size] = React.useState(14);
  const [state_ace_show_gutter, set_state_ace_show_gutter] = React.useState(
    true
  );
  const [
    state_ace_show_print_margin,
    set_state_ace_show_print_margin
  ] = React.useState(true);
  const [
    state_ace_highlight_active_line,
    set_state_ace_highlight_active_line
  ] = React.useState(true);

  const [
    state_ace_show_line_numbers,
    set_state_ace_show_line_numbers
  ] = React.useState(true);
  const [state_ace_tab_size, set_state_ace_tab_size] = React.useState(2);
  const [state_ace_options, set_state_ace_options] = React.useState({});

  const update_last_log = (message) => {
    if (message !== "")
      set_state_last_log(
        `[${Util.get_time_hms()}] ${message} >> After fix, press [ctrl + s] again`
      );
    else set_state_last_log("");
  };

  const validate = (source) => {
    try {
      source = props.format(source, state_ace_mode);
      props.on_validate(source);

      set_state_source(source);
      set_state_draft_mode(false);
      update_last_log("");
    } catch (e) {
      update_last_log(`Unable to validate JSON source. Error[${e.message}]`);
    }
  };

  const on_key_down = (event) => {
    const charCode = String.fromCharCode(event.which).toLowerCase();

    // ctrl + s
    if (event.ctrlKey && charCode === "s") {
      event.preventDefault();
      validate(state_source);
    }
  };

  const on_change = (source) => {
    set_state_source(source);
    set_state_draft_mode(true);
  };

  React.useEffect(() => {
    set_state_ace_options({
      useWorker: false,
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      enableSnippets: false,
      showLineNumbers: state_ace_show_line_numbers,
      tabSize: state_ace_tab_size
    });
  }, [state_ace_show_line_numbers, state_ace_tab_size]);

  React.useEffect(() => {
    let source = props.init.source;
    source = props.format(source, state_ace_mode);
    set_state_source(source);
    set_state_draft_mode(true);
  }, [props.init.source]);

  React.useEffect(() => {
    if (props.on_change_draft_mode)
      props.on_change_draft_mode(state_draft_mode);
  }, [state_draft_mode]);

  return (
    <div onKeyDown={on_key_down}>
      {state_draft_mode === true && (
        <div className="bar" style={{ color: "red" }}>
          Editor: (Draft mode). To leave draft mode press [ctrl + s].
        </div>
      )}
      {state_last_log !== "" && (
        <div className="bar" style={{ color: "red" }}>
          Editor: {state_last_log}
        </div>
      )}
      <div className="bar">
        <div className="element">
          <label>Show gutter:</label>
          <input
            name="show gutter"
            type="checkbox"
            checked={state_ace_show_gutter}
            onChange={(e) => set_state_ace_show_gutter(e.target.checked)}
          />
        </div>
        <div className="element">
          <label>Show print margin:</label>
          <input
            name="show print margin"
            type="checkbox"
            checked={state_ace_show_print_margin}
            onChange={(e) => set_state_ace_show_print_margin(e.target.checked)}
          />
        </div>
        <div className="element">
          <label>Highlight active line:</label>
          <input
            name="highlight active line"
            type="checkbox"
            checked={state_ace_highlight_active_line}
            onChange={(e) =>
              set_state_ace_highlight_active_line(e.target.checked)
            }
          />
        </div>
        <div className="element">
          <label>Show line numbers:</label>
          <input
            name="show line numbers"
            type="checkbox"
            checked={state_ace_show_line_numbers}
            onChange={(e) => set_state_ace_show_line_numbers(e.target.checked)}
          />
        </div>
        <div className="element">
          <label>Font size:</label>
          <input
            className="input_value"
            key="font size"
            name="font size"
            type="number"
            value={state_ace_font_size}
            min={1}
            max={30}
            step={1}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 1 && value <= 30)
                set_state_ace_font_size(parseInt(value));
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
            value={state_ace_tab_size}
            min={1}
            max={30}
            step={1}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 1 && value <= 30)
                set_state_ace_tab_size(parseInt(value));
            }}
          />
        </div>
        <div className="element">
          <label>Theme:</label>
          <select
            name="Theme"
            onChange={(e) => set_state_ace_theme(e.target.value)}
            value={state_ace_theme}
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        <div className="element">
          <label>Highlight:</label>
          <select
            name="ParseMode"
            onChange={(e) => set_state_ace_mode(e.target.value)}
            value={state_ace_mode}
          >
            {props.ace_modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        <div className="element">
          <label>Validate/Parse (ctrl + s)</label>
        </div>
      </div>
      <div className="source_editor">
        <AceEditor
          height={"100%"}
          width={"100%"}
          mode={state_ace_mode}
          theme={state_ace_theme}
          name="editor_name"
          onChange={on_change}
          value={state_source}
          fontSize={state_ace_font_size}
          showPrintMargin={state_ace_show_print_margin}
          showGutter={state_ace_show_gutter}
          highlightActiveLine={state_ace_highlight_active_line}
          setOptions={state_ace_options}
        />
      </div>
    </div>
  );
}

export default Editor;
