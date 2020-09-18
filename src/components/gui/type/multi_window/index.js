import React from "react";

import { AppContext } from "../../../../context/app";

import GoldenLayout from "../../layout/golden_layout";
import useGoldenLayout from "../../layout/golden_layout/hook";
import Navigation from "../../navigation";

import WindowsManager from "../../../windows/windows_manager";
import Settings from "../../../windows/settings";
import SyncButton from "../../../buttons/sync";

import "./index.css";

function Gui_MultiWindow(props) {
  const { context_app_session_data } = React.useContext(AppContext);

  const {
    hook_golden_layout_config,
    hook_golden_layout_display_mode,
    hook_golden_layout_ref,
    hook_golden_layout_fn
  } = useGoldenLayout({
    windows: props.module_data.windows,
    is_desktop_or_laptop: props.is_desktop_or_laptop,
    settings: context_app_session_data._settings
  });

  return (
    <React.Fragment>
      <Navigation
        buttons={[
          {
            type: "custom",
            float: "left",
            component: <SyncButton />
          },
          {
            type: "tooltip",
            float: "right",
            name: "Settings",
            component: <Settings />
          },
          {
            type: "tooltip",
            float: "right",
            name: "Windows manager",
            component: (
              <WindowsManager
                windows_list={props.module_data.windows}
                display_mode={hook_golden_layout_display_mode}
                on_add_window={hook_golden_layout_fn.add_window}
              />
            )
          }
        ]}
      />
      <div className="main-window-content">
        <GoldenLayout
          golden_layout_fn={hook_golden_layout_fn}
          windows_config={hook_golden_layout_config}
          golden_layout_ref={hook_golden_layout_ref}
        />
      </div>
    </React.Fragment>
  );
}

export default Gui_MultiWindow;
