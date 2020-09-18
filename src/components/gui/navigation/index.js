import React from "react";
import Tooltip from "./tooltip";
import { v4 as uuidv4 } from "uuid";

import "./index.css";

function Navigation({ buttons = [] }) {
  return (
    <div id="main_navigation" className="main-window-bar">
      {buttons.map(({ float, name, type, component }) => {
        const element =
          type === "tooltip" ? (
            <Tooltip child={component} name={name} />
          ) : (
            component
          );
        return (
          <div key={uuidv4()} style={{ float }}>
            {element}
          </div>
        );
      })}
    </div>
  );
}

export default Navigation;
