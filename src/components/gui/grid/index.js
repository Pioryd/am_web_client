import React from "react";

import Navigation from "../../navigation";
import GridLayout from "../../layout/grid_layout";

import "./index.css";

function Gui_Grid({ module_data }) {
  const [state_windows] = React.useState(() => {
    const components_list = [];
    for (const window of Object.values(module_data.windows)) {
      components_list.push(
        <div className="form-panel">
          <div className="title">{window.title}</div>
          <div className="edit_data" onMouseDown={(e) => e.stopPropagation()}>
            <window.class />
          </div>
        </div>
      );
    }
    return components_list;
  });

  return (
    <React.Fragment>
      <Navigation enabled_windows_list={false} />
      <div className="main-window-content">
        <GridLayout config={module_data.grid_layouts} windows={state_windows} />
      </div>
    </React.Fragment>
  );
}

export default Gui_Grid;
