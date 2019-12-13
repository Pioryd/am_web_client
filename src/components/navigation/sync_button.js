import React from "react";
import { AppContext } from "../../context/app";
function SyncButton(props) {
  const { context_on_toggle_sync } = React.useContext(AppContext);
  const state_form = {
    enabled: {
      enabled: true,
      text: "Pause sync",
      style: { backgroundColor: "#06dd58" }
    },
    disabled: {
      enabled: false,
      text: "Restart sync",
      style: { backgroundColor: "#ff0000" }
    }
  };

  const [state, set_state] = React.useState(state_form.disabled);

  const toggle_sync = () => {
    context_on_toggle_sync(!state.enabled);

    if (state.enabled) set_state(state_form.disabled);
    else set_state(state_form.enabled);
  };

  return (
    <button
      style={state.style}
      onClick={e => {
        e.preventDefault();
        toggle_sync();
      }}
    >
      {state.text}
    </button>
  );
}

export default SyncButton;
