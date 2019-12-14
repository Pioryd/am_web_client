import React from "react";
import { GuiContext } from "../../gui_context";

function ButtonsList(props) {
  const { context_windows_list, context_on_add_window } = React.useContext(
    GuiContext
  );
  const [state_buttons, set_state_buttons] = React.useState({});
  const [state_elements, set_state_elements] = React.useState([]);

  const open = e => {
    e.preventDefault();

    let buttons = { ...state_buttons };
    let button_id = e.target.id;

    if (!(button_id in buttons)) return;

    buttons[button_id].enabled = !buttons[button_id].enabled;

    set_state_buttons(buttons);

    context_on_add_window(button_id);
  };

  React.useEffect(() => {
    set_state_buttons(context_windows_list);
  }, []);

  React.useEffect(() => {
    let elements = [];
    for (const [key] of Object.entries(state_buttons)) {
      elements.push(
        <button
          className="button"
          id={key}
          key={key}
          onClick={e => {
            open(e);
          }}
        >
          {state_buttons[key].title}
        </button>
      );
    }
    set_state_elements(elements);
  }, [state_buttons]);

  return <React.Fragment>{state_elements}</React.Fragment>;
}

export default ButtonsList;
