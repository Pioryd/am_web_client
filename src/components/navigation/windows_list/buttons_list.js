import React from "react";
import { GuiContext } from "../../gui_context";

function ButtonsList(props) {
  const styles = {
    enabled: { backgroundColor: "#06dd58" },
    disabled: { backgroundColor: "#c0c4c1" }
  };
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

    buttons[button_id].style = buttons[button_id].enabled
      ? styles.enabled
      : styles.disabled;

    set_state_buttons(buttons);

    context_on_add_window(button_id);
  };

  React.useEffect(() => {
    let buttons = context_windows_list;

    for (const key of Object.keys(buttons)) {
      buttons[key].style = buttons[key].enabled
        ? styles.enabled
        : (buttons[key].style = styles.disabled);
    }

    set_state_buttons(buttons);
  }, []);

  React.useEffect(() => {
    let elements = [];
    for (const key of Object.keys(state_buttons)) {
      elements.push(
        <input
          type="button"
          className="droplistelmbtn"
          id={key}
          key={key}
          value={state_buttons[key].title}
          style={state_buttons[key].style}
          onClick={e => {
            open(e);
          }}
        ></input>
      );
    }
    set_state_elements(elements);
  }, [state_buttons]);

  return <React.Fragment>{state_elements}</React.Fragment>;
}

export default ButtonsList;
