import React from "react";

function InputRow(props) {
  const [state_key, set_state_key] = React.useState("");
  const [state_value, set_state_value] = React.useState("");

  const ref_text_input = React.useRef();

  React.useEffect(() => {
    set_state_key(props.row_key);
  }, [props]);

  return (
    <div className="row">
      <div className="name" key={state_key + "_key"}>
        {state_key}
      </div>
      <input
        ref={ref_text_input}
        className="input_value"
        key={state_key + "_value"}
        name={state_key}
        type="text"
        onChange={e => {
          set_state_value(e.target.value);
        }}
      ></input>
      <button
        className="process"
        onClick={e => {
          props.on_process(state_value);
          set_state_value("");
          ref_text_input.current.value = "";
        }}
      >
        process
      </button>
    </div>
  );
}

export default InputRow;
