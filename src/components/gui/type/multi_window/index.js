import React from "react";

import { AppContext } from "../../../../context/app";

import GoldenLayout from "../../layout/golden_layout";
import useGoldenLayout from "../../layout/golden_layout/hook";
import Navigation from "../../navigation";

import WindowsManager from "../../../windows/windows_manager";
import Settings from "../../../windows/settings";
import Sync from "../../../buttons/sync";
import ChangeDisplay from "../../../buttons/gl_change_display";

import "./index.css";

const get_view_mode = (is_big_screen) => (is_big_screen ? "desktop" : "mobile");

function Gui_MultiWindow(props) {
  const { context_app_session_data, context_app_fn } = React.useContext(
    AppContext
  );

  const [state_view_mode, set_state_view_mode] = React.useState(
    get_view_mode(props.is_desktop_or_laptop)
  );

  const {
    hook_golden_layout_instance_key,
    hook_golden_layout_settings,
    hook_golden_layout_display_mode,
    hook_golden_layout_ref,
    hook_golden_layout_fn
  } = useGoldenLayout({
    windows: props.module_data.windows,
    view_mode: get_view_mode(props.is_desktop_or_laptop),
    settings: { ...context_app_session_data.golden_layout }
  });

  const button = {
    toggle_display_mode() {
      hook_golden_layout_fn.set_display_mode(
        hook_golden_layout_display_mode === "custom"
          ? state_view_mode
          : "custom"
      );
    }
  };

  React.useEffect(
    () =>
      context_app_fn.update_session({
        golden_layout: { ...hook_golden_layout_settings }
      }),
    [hook_golden_layout_settings]
  );

  React.useEffect(() => hook_golden_layout_fn.set_view_mode(state_view_mode), [
    state_view_mode
  ]);

  React.useEffect(
    () => set_state_view_mode(get_view_mode(props.is_desktop_or_laptop)),
    [props.is_desktop_or_laptop]
  );

  return (
    <React.Fragment>
      <Navigation
        buttons={[
          {
            type: "custom",
            float: "left",
            component: <Sync />
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
                on_add_window={hook_golden_layout_fn.add_window}
              />
            )
          },
          {
            type: "custom",
            float: "right",
            component: (
              <ChangeDisplay
                toggle={() => button.toggle_display_mode()}
                view_mode={state_view_mode}
                display_mode={hook_golden_layout_display_mode}
              />
            )
          }
        ]}
      />
      <div className="main-window-content">
        <GoldenLayout
          key={hook_golden_layout_instance_key}
          golden_layout_fn={hook_golden_layout_fn}
          windows_config={hook_golden_layout_settings.config}
          golden_layout_ref={hook_golden_layout_ref}
        />
      </div>
    </React.Fragment>
  );
}

export default Gui_MultiWindow;
