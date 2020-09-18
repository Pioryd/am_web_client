import React from "react";
import { useWindowHeight } from "@react-hook/window-size";
import Tooltip from "rc-tooltip";

import "rc-tooltip/assets/bootstrap_white.css";

function TooltipWindow({ child, name }) {
  const height = useWindowHeight();

  return (
    <Tooltip
      placement="bottom"
      trigger={["click"]}
      overlay={child}
      overlayInnerStyle={{
        height: height - 100 + "px",
        background: "#000000"
      }}
    >
      <button>{name}</button>
    </Tooltip>
  );
}

export default TooltipWindow;
