import React from "react";
import { ConnectionContext } from "../../context/connection";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

const STATE_STYLES = {
  enabled: {
    enabled: true,
    style: { backgroundColor: "#06dd58" }
  },
  disabled: {
    enabled: false,
    style: { backgroundColor: "#ff0000" }
  }
};

function SyncButton(props) {
  const { context_connection_fn, context_connection_info } = React.useContext(
    ConnectionContext
  );

  const [state_button_style, set_state_button_style] = React.useState(
    STATE_STYLES.disabled
  );

  const toggle_sync = () =>
    context_connection_fn.set_enabled(!state_button_style.enabled);

  React.useEffect(
    () =>
      set_state_button_style(
        context_connection_info.enabled
          ? STATE_STYLES.enabled
          : STATE_STYLES.disabled
      ),
    [context_connection_info]
  );

  return (
    <React.Fragment>
      <Tooltip
        placement="bottom"
        trigger={["hover"]}
        overlay={<span>{context_connection_info.id}</span>}
      >
        <button style={state_button_style.style} onClick={(e) => toggle_sync()}>
          {context_connection_info.status}
        </button>
      </Tooltip>
    </React.Fragment>
  );
}

export default SyncButton;
