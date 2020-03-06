import React from "react";
import { ProtocolContext } from "../../context/protocol";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

function SyncButton(props) {
  const { context_connection_fn, context_connection_info } = React.useContext(
    ProtocolContext
  );
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
    context_connection_info.enabled ? state_form.enabled : state_form.disabled
  );

  const toggle_sync = () => {
    context_connection_fn.set_enabled(!state.enabled);

    if (state.enabled) set_state(state_form.disabled);
    else set_state(state_form.enabled);
  };

  return (
    <React.Fragment>
      <Tooltip
        placement="bottom"
        trigger={["hover"]}
        overlay={<span>{context_connection_info.id}</span>}
      >
        <button
          style={state.style}
          onClick={e => {
            e.preventDefault();
            toggle_sync();
          }}
        >
          {context_connection_info.status}
        </button>
      </Tooltip>
    </React.Fragment>
  );
}

export default SyncButton;
