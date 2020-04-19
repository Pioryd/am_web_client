import React from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";

import MultiWindow from "./multi_window";
import Grid from "./grid";

import { AppContext } from "../../context/app";

import ProtocolProvider from "../../context/protocol";

import RootWindows from "../windows";

import WorldAdmin from "../../modules/admin";
import WorldCharacter from "../../modules/world_character";
import VirtualWorld from "../../modules/virtual_world";

// Windows map
const module_windows_map = {};
module_windows_map["admin"] = WorldAdmin.windows_map;
module_windows_map["world_character"] = WorldCharacter.windows_map;
module_windows_map["virtual_world"] = VirtualWorld.windows_map;

function Gui(props) {
  const hook_is_desktop_or_laptop = useMediaQuery({ minWidth: 992 });

  const [state_windows_map] = React.useState({
    ...RootWindows.windows_map,
    ...module_windows_map[props.login_data.module]
  });

  // In this file use [get_merged_settings] instead of [context_settings]
  // For more info go to: [get_merged_settings]
  const { context_settings, context_set_settings } = React.useContext(
    AppContext
  );

  // In this file use [get_merged_settings] instead of [context_settings]
  // Because most functionality need [context_settings] at initialization, when
  // is not merged yet(merge in useEffect is after first render-initialization),
  // so we have to force it.
  const get_merged_settings = () => {
    return { ...context_settings, ...props.login_data };
  };

  React.useEffect(() => context_set_settings(get_merged_settings()), []);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {`[${get_merged_settings().module}]<${
            get_merged_settings().accept_connection_data.login
          }> - AM`}
        </title>
      </Helmet>

      <ProtocolProvider settings={get_merged_settings()}>
        {props.type === "multi_window" && (
          <MultiWindow
            windows_map={state_windows_map}
            is_desktop_or_laptop={hook_is_desktop_or_laptop}
            settings={get_merged_settings()}
          />
        )}
        {props.type === "grid" && (
          <Grid
            windows_map={state_windows_map}
            is_desktop_or_laptop={hook_is_desktop_or_laptop}
            settings={get_merged_settings()}
          />
        )}
      </ProtocolProvider>
    </React.Fragment>
  );
}

export default Gui;
