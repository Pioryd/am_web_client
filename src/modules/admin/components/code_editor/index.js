import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

import "./index.css";

function CodeEditor() {
  const [state_value, set_state_value] = React.useState("");
  const [state_placeholder, set_state_placeholder] = React.useState(
    "write code here"
  );
  const [state_theme, set_state_theme] = React.useState("monokai");
  const [state_mode, set_state_mode] = React.useState("javascript");
  const [
    state_enable_basic_autocompletion,
    set_state_enable_basic_autocompletion
  ] = React.useState(true);
  const [
    state_enable_live_autocompletion,
    set_state_enable_live_autocompletion
  ] = React.useState(true);
  const [state_font_size, set_state_font_size] = React.useState(14);
  const [state_show_gutter, set_state_show_gutter] = React.useState(true);
  const [state_show_print_margin, set_state_show_print_margin] = React.useState(
    true
  );
  const [
    state_highlight_active_line,
    set_state_highlight_active_line
  ] = React.useState(true);
  const [state_enable_snippets, set_state_enable_snippets] = React.useState(
    true
  );
  const [state_show_line_numbers, set_state_show_line_numbers] = React.useState(
    true
  );
  const [state_tab_size, set_state_tab_size] = React.useState(2);
  const [state_options, set_state_options] = React.useState({});

  React.useEffect(() => {
    set_state_options({
      useWorker: false,
      enableBasicAutocompletion: state_enable_basic_autocompletion,
      enableLiveAutocompletion: state_enable_live_autocompletion,
      enableSnippets: state_enable_snippets,
      showLineNumbers: state_show_line_numbers,
      tabSize: state_tab_size
    });
  }, [
    state_enable_basic_autocompletion,
    state_enable_live_autocompletion,
    state_enable_snippets,
    state_show_line_numbers,
    state_tab_size
  ]);

  return (
    <div className="code_editor">
      <div className="options">
        <label>
          <input
            name="basic autocompletion"
            type="checkbox"
            checked={state_enable_basic_autocompletion}
            onChange={e => {
              set_state_enable_basic_autocompletion(e.target.checked);
            }}
          />
          basic autocompletion
        </label>
        <label>
          <input
            name="live autocompletion"
            type="checkbox"
            checked={state_enable_live_autocompletion}
            onChange={e => {
              set_state_enable_live_autocompletion(e.target.checked);
            }}
          />
          live autocompletion
        </label>
        <label>
          <input
            name="show gutter"
            type="checkbox"
            checked={state_show_gutter}
            onChange={e => {
              set_state_show_gutter(e.target.checked);
            }}
          />
          show gutter
        </label>
        <label>
          <input
            name="show print margin"
            type="checkbox"
            checked={state_show_print_margin}
            onChange={e => {
              set_state_show_print_margin(e.target.checked);
            }}
          />
          show print margin
        </label>
        <label>
          <input
            name="highlight active line"
            type="checkbox"
            checked={state_highlight_active_line}
            onChange={e => {
              set_state_highlight_active_line(e.target.checked);
            }}
          />
          highlight active line
        </label>
        <label>
          <input
            name="enable snippets"
            type="checkbox"
            checked={state_enable_snippets}
            onChange={e => {
              set_state_enable_snippets(e.target.checked);
            }}
          />
          enable snippets
        </label>
        <label>
          <input
            name="show line numbers"
            type="checkbox"
            checked={state_show_line_numbers}
            onChange={e => {
              set_state_show_line_numbers(e.target.checked);
            }}
          />
          show line numbers
        </label>
        <label>
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
          font size
        </label>
        <label>
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
          tab size
        </label>
      </div>
      <div className="editor">
        <AceEditor
          placeholder={state_placeholder}
          mode={state_mode}
          theme={state_theme}
          name="editor_name"
          onLoad={() => {}}
          onChange={new_value => {
            set_state_value(new_value);
          }}
          onSelectionChange={() => {}}
          onCursorChange={() => {}}
          onValidate={() => {}}
          value={state_value}
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

export default CodeEditor;
