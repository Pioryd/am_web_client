import React from "react";
import ResizeObserver from "rc-resize-observer";

import "./index.css";

const ModuleWindow = (props) => {
  const [state_bar_height, set_state_bar_height] = React.useState(0);

  return (
    <div className="mU9_window">
      <ResizeObserver onResize={({ height }) => set_state_bar_height(height)}>
        <div className="mU9_bar">{props.bar}</div>
      </ResizeObserver>
      <div
        className="mU9_content"
        style={{ height: `calc(100% - ${state_bar_height}px)` }}
      >
        {props.content}
      </div>
    </div>
  );
};

export default ModuleWindow;
