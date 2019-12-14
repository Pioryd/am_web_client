import React from "react";
import { AppContext } from "../../context/app";
function SyncButton(props) {
  const {
    context_on_toggle_sync,
    context_connection_status,
    context_connection_enabled
  } = React.useContext(AppContext);
  const state_form = {
    enabled: {
      enabled: true,
      style: { backgroundColor: "#06dd58" }
    },
    disabled: {
      enabled: false,
      style: { backgroundColor: "#ff0000" }
    }
  };

  const [state, set_state] = React.useState(
    context_connection_enabled ? state_form.enabled : state_form.disabled
  );

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
      {context_connection_status}
    </button>
  );
}

export default SyncButton;
