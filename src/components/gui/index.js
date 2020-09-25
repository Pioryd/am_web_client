import React from "react";
import _ from "lodash";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";

import MultiWindow from "./type/multi_window";
import Grid from "./type/grid";

import Modules from "../../modules";
import { AppContext } from "../../context/app";

import "./index.css";

function Gui(props) {
  const { context_app_session_data } = React.useContext(AppContext);

  const hook_is_desktop_or_laptop = useMediaQuery({ minWidth: 992 });

  const [state_module_data, set_state_module_data] = React.useState({});
  const [state_title, set_state_title] = React.useState("");
  const [state_type, set_state_type] = React.useState("");

  React.useEffect(() => {
    const { connection } = context_app_session_data.root;
    const { module } = context_app_session_data.settings;

    set_state_module_data({ ...Modules[module] });
    set_state_title(`[${module}]<${connection.accept_data.login}> - AM`);
    set_state_type(Modules[module].gui_type);
  }, [context_app_session_data]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{state_title}</title>
      </Helmet>
      <div className="main-window">
        {state_type === "multi_window" && (
          <MultiWindow
            module_data={state_module_data}
            is_desktop_or_laptop={hook_is_desktop_or_laptop}
          />
        )}
        {state_type === "grid" && (
          <Grid
            module_data={state_module_data}
            is_desktop_or_laptop={hook_is_desktop_or_laptop}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default Gui;
