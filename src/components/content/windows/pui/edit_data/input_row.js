import React from "react";

function InputRow(props) {
  const [state_key, set_state_key] = React.useState("");

  const ref_text_input = React.useRef();

  React.useEffect(() => {
    set_state_key(props.row_key);
  }, [props]);

  return (
    <div className="row">
      <div className="main">
        <div className="name" key={state_key + "_key"}>
          {state_key}
        </div>
        <input
          ref={ref_text_input}
          className="input_value"
          key={state_key + "_value"}
          name={state_key}
          type="text"
        ></input>
        <button
          className="process"
          onClick={e => {
            props.on_process(ref_text_input.current.value);
            ref_text_input.current.value = "";
          }}
        >
          process
        </button>
      </div>
      <div className="children">{props.children}</div>
    </div>
  );
}

export default InputRow;
