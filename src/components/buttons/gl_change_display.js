import React from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";

function ChangeDisplay({ toggle, view_mode, display_mode }) {
  return (
    <Tooltip
      placement="bottom"
      trigger={["hover"]}
      overlay={
        <React.Fragment>
          <p>View:{view_mode}</p>
          <p>Display:{display_mode}</p>
        </React.Fragment>
      }
    >
      <button onClick={() => toggle()}>
        Display
        {display_mode === "custom" ? "[custom]" : "[auto]"}
      </button>
    </Tooltip>
  );
}

export default ChangeDisplay;
