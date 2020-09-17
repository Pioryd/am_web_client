import _ from "lodash";

import React from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";

import MultiWindow from "./multi_window";
import Grid from "./grid";

import { AppContext } from "../../context/app";

import RootWindows from "../windows";

import WorldAdmin from "../../modules/admin";
import VirtualWorld from "../../modules/virtual_world";

// Windows map
const modules_data = {};
modules_data["admin"] = WorldAdmin;
modules_data["virtual_world"] = VirtualWorld;

function Gui(props) {
  const { context_app_session_data } = React.useContext(AppContext);

  const hook_is_desktop_or_laptop = useMediaQuery({ minWidth: 992 });
  const [state_module_data] = React.useState(
    _.merge(
      RootWindows,
      modules_data[context_app_session_data._settings.module]
    )
  );

  const [state_title, set_state_title] = React.useState("");

  const set_title = () => {
    const {
      module,
      accept_connection_data
    } = context_app_session_data._settings;
    set_state_title(`[${module}]<${accept_connection_data.login}> - AM`);
  };

  React.useEffect(() => set_title(), [context_app_session_data]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{state_title}</title>
      </Helmet>
      {["admin"].includes(context_app_session_data._settings.module) && (
        <MultiWindow
          module_data={state_module_data}
          is_desktop_or_laptop={hook_is_desktop_or_laptop}
        />
      )}
      {["virtual_world"].includes(
        context_app_session_data._settings.module
      ) && (
        <Grid
          module_data={state_module_data}
          is_desktop_or_laptop={hook_is_desktop_or_laptop}
        />
      )}
    </React.Fragment>
  );
}

export default Gui;
