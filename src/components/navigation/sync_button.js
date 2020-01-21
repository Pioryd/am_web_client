import React from "react";
import { ProtocolContext } from "../../context/protocol";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

function SyncButton(props) {
  const {
    context_connection_toggle,
    context_connection_status,
    context_connection_enabled,
    context_connection_id
  } = React.useContext(ProtocolContext);
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
    context_connection_toggle(!state.enabled);

    if (state.enabled) set_state(state_form.disabled);
    else set_state(state_form.enabled);
  };

  return (
    <React.Fragment>
      <Tooltip
        placement="bottom"
        trigger={["hover"]}
        overlay={<span>{context_connection_id}</span>}
      >
        <button
          style={state.style}
          onClick={e => {
            e.preventDefault();
            toggle_sync();
          }}
        >
          {context_connection_status}
        </button>
      </Tooltip>
    </React.Fragment>
  );
}

export default SyncButton;
