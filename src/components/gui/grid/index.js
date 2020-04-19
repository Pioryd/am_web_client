import React from "react";

import Navigation from "../../navigation";
import Form from "react-jsonschema-form";
import GridLayout from "../../layout/grid_layout";
import props_data from "./props_data";

import "./index.css";

function Gui_Grid(props) {
  const [state_form_data, set_state_form_data] = React.useState({});
  const [state_windows] = React.useState(() => {
    const windows = [];
    for (const name of props_data.grid_windows) {
      const window_data = props_data.windows[name];
      let window = null;
      if (window_data.type === "form") {
        window = (
          <Form
            schema={window_data.schema.json}
            uiSchema={window_data.schema.ui}
            // onChange={form_data_changed}
            formData={state_form_data}
          >
            <br />
          </Form>
        );
      }
      windows.push(
        <div className="form-panel">
          <div className="edit_data">{window}</div>
        </div>
      );
    }
    return windows;
  });

  return (
    <React.Fragment>
      <Navigation enabled_windows_list={false} />
      <div className="main-window-content">
        <GridLayout config={props_data.grid_layouts} windows={state_windows} />
      </div>
    </React.Fragment>
  );
}

export default Gui_Grid;
