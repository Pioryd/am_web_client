import React from "react";

import GoldenLayout from "../../layout/golden_layout";
import useGoldenLayout from "../../layout/golden_layout/hook";

import Navigation from "../../navigation";

import "./index.css";

function Gui_MultiWindow(props) {
  const {
    hook_golden_layout_fn,
    hook_golden_layout_config,
    hook_golden_layout_display_mode,
    hook_golden_layout_ref
  } = useGoldenLayout({
    windows_map: props.module_data.windows_map,
    is_desktop_or_laptop: props.is_desktop_or_laptop,
    settings: props.settings
  });

  return (
    <React.Fragment>
      <Navigation
        windows_list={props.module_data.windows_map}
        display_mode={hook_golden_layout_display_mode}
        on_add_window={hook_golden_layout_fn.add_window}
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
