import React from "react";

import "./index.css";

function ButtonsList(props) {
  const [state_buttons, set_state_buttons] = React.useState({});
  const [state_elements, set_state_elements] = React.useState([]);

  const open = (e) => {
    e.preventDefault();

    let buttons = { ...state_buttons };
    let button_id = e.target.id;

    if (!(button_id in buttons)) return;

    buttons[button_id].enabled = !buttons[button_id].enabled;

    set_state_buttons(buttons);

    props.on_add_window(button_id);
  };

  React.useEffect(() => {
    set_state_buttons(props.windows_list);
  }, []);

  React.useEffect(() => {
    let elements = [];
    for (const [key] of Object.entries(state_buttons)) {
      elements.push(
        <button className="button" id={key} key={key} onClick={(e) => open(e)}>
          {state_buttons[key].title}
        </button>
      );
    }
    set_state_elements(elements);
  }, [state_buttons]);

  return (
    <div className="dropdown-buttons-list">
      {state_elements}
      <button
        className="button"
        style={{ color: "red" }}
        id="clear_saved_state"
        key="clear_saved_state"
        onClick={(e) => localStorage.removeItem("am_gl_saved_states")}
      >
        Clear saved state
      </button>
      <label>Display mode [{props.display_mode}]</label>
    </div>
  );
}

export default ButtonsList;
