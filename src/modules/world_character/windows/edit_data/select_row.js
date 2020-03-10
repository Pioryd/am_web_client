import React from "react";
import Select from "react-select";

const styles = {
  container: base => ({
    ...base,
    position: "relative",
    width: "100px",
    height: "10px",
    float: "left"
  })
};

function SelectRow(props) {
  const [state_key, set_state_key] = React.useState("");
  const [state_value, set_state_value] = React.useState(1);
  const [state_options, set_state_options] = React.useState([]);

  const [state_selected_value, set_state_selected_value] = React.useState([]);
  const [state_selected_name, set_state_selected_name] = React.useState("-");

  React.useEffect(() => {
    if (props.row_key != null) set_state_key(props.row_key);
    if (props.row_value != null) set_state_value(props.row_value);
    if (props.row_options != null) set_state_options(props.row_options);
  }, [props]);

  return (
    <div className="row">
      <div className="main">
        <div className="name" key={state_key + "_key"}>
          {state_key}
        </div>
        <Select
          styles={styles}
          value={state_value}
          onChange={option => {
            set_state_selected_value(option.value);
            set_state_selected_name(option.label);
          }}
          options={state_options}
        />
        <div className="select_value_selected">{state_selected_name}</div>
        <button
          className="process"
          onClick={e => {
            if (!Array.isArray(state_selected_value)) {
              props.on_process(state_selected_value);

              set_state_selected_value([]);
              set_state_selected_name("-");
            }
          }}
        >
          process
        </button>
      </div>
      <div className="children">{props.children}</div>
    </div>
  );
}

export default SelectRow;
