import React from "react";

import "./index.css";

function WindowsManager(props) {
  const [state_buttons, set_state_buttons] = React.useState(props.windows_list);

  const open_window = (id) => {
    const buttons = { ...state_buttons };
    const button_id = id;

    if (!(button_id in buttons)) return;

    buttons[button_id].enabled = !buttons[button_id].enabled;

    set_state_buttons(buttons);

    props.on_add_window(button_id);
  };

  return (
    <div className="dropdown-buttons-list">
      {Object.keys(state_buttons).map((id) => {
        return (
          <button
            className="button"
            id={id}
            key={id}
            onClick={(e) => {
              e.preventDefault();
              open_window(e.target.id);
            }}
          >
            {state_buttons[id].title}
          </button>
        );
      })}
    </div>
  );
}

export default WindowsManager;
