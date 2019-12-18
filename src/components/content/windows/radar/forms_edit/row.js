import React from "react";

function Row(props) {
  const [
    state_input_background_color,
    set_state_input_background_color
  ] = React.useState("#ffffff");
  const [state_input_color, set_state_input_color] = React.useState("#000000");

  const change_background_color = background_color => {
    if (background_color.substring(0, 1) !== "#") background_color = "#ffffff";
    set_state_input_background_color(background_color);
  };

  const [state_key, set_state_key] = React.useState();
  const [state_value, set_state_value] = React.useState();

  const on_value_change = e => {
    const key = e.target.name;
    const value = e.target.value;

    props.on_value_change(key, value);
    change_background_color(value);
    set_state_value(value);
  };

  React.useEffect(() => {
    const value = props.row_value;

    let input_color = "#000000";
    if (typeof value === "number" || value instanceof Number)
      input_color = "#ff8c00";
    else if (typeof value === "string" || value instanceof String)
      input_color = "#008000";
    else if (typeof value === "boolean" || value instanceof Boolean)
      input_color = "#0000ff";
    else if (value === null || typeof value == null)
      input_color = "#ff00ff";

    set_state_input_color(input_color);

    if (typeof value === "string" || value instanceof String)
      change_background_color(value);

    set_state_key(props.row_key);
    set_state_value(props.row_value);
  }, [props]);

  return (
    <div className="row">
      <div
        className="name"
        key={state_key + "_key"}
        style={{ color: "#ff0000" }}
      >
        {state_key}
      </div>
      <input
        className="value"
        key={state_key + "_value"}
        name={state_key}
        type="text"
        style={{
          color: state_input_color,
          backgroundColor: state_input_background_color
        }}
        value={state_value}
        onChange={e => {
          on_value_change(e);
        }}
      ></input>
    </div>
  );
}

export default Row;
