import React from "react";
import _ from "lodash";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";

import MultiWindow from "./multi_window";
import Grid from "./grid";
import RootWindows from "../windows";

import Modules from "../../modules";
import { AppContext } from "../../context/app";

function Gui(props) {
  const { context_app_session_data } = React.useContext(AppContext);

  const hook_is_desktop_or_laptop = useMediaQuery({ minWidth: 992 });

  const [state_module_data, set_state_module_data] = React.useState({});
  const [state_title, set_state_title] = React.useState("");
  const [state_type, set_state_type] = React.useState("");

  React.useEffect(() => {
    const {
      module,
      accept_connection_data
    } = context_app_session_data._settings;

    set_state_module_data(_.merge({ ...RootWindows }, Modules[module]));
    set_state_title(`[${module}]<${accept_connection_data.login}> - AM`);
    set_state_type(Modules[module].gui_type);
  }, [context_app_session_data]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{state_title}</title>
      </Helmet>
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
    </React.Fragment>
  );
}

export default Gui;
