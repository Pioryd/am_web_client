import React from "react";
import Util from "../../framework/util";

import { GoldenLayoutComponent } from "../layout/goldenLayoutComponent";

import { AppContext } from "../../context/app";

import ProtocolProvider from "../../context/protocol";
import GuiProvider from "../../context/gui";

import Navigation from "../navigation";

import Settings from "../windows/settings";

import WorldAdmin from "../../modules/world_admin";
import WorldCharacter from "../../modules/world_character";

import "./index.css";

let ModuleWindowsMap = [];
const module_name = Util.get_formated_url_path().module;
if (module_name === "world_admin") {
  ModuleWindowsMap = WorldAdmin.windows_map;
} else if (module_name === "world_character") {
  ModuleWindowsMap = WorldCharacter.windows_map;
}

function Gui() {
  const windows_map = {
    settings: { class: Settings, title: "Client settings" },
    ...ModuleWindowsMap
  };

  const { context_settings } = React.useContext(AppContext);

  const ref_golden_layout = React.createRef();

  const helper = {
    get_layout_root: () => {
      if (
        ref_golden_layout != null &&
        ref_golden_layout.current != null &&
        ref_golden_layout.current.goldenLayoutInstance != null &&
        ref_golden_layout.current.goldenLayoutInstance.root != null
      )
        return ref_golden_layout.current.goldenLayoutInstance.root;
      else return null;
    },
    get_layout_instance: () => {
      if (
        ref_golden_layout != null &&
        ref_golden_layout.current != null &&
        ref_golden_layout.current.goldenLayoutInstance != null
      )
        return ref_golden_layout.current.goldenLayoutInstance;
      else return null;
    }
  };

  const add_window = (window_name, content_ui) => {
    const root = helper.get_layout_root();
    if (root == null) return;

    root.contentItems[0].addChild({
      title: windows_map[window_name].title,
      type: "react-component",
      component: window_name,
      props: {
        id: { window_name },
        key: window_name,
        title: windows_map[window_name].title
      }
    });
  };

  React.useLayoutEffect(() => {
    function updateSize() {
      const layout_instance = helper.get_layout_instance();
      if (layout_instance == null) return;

      layout_instance.updateSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <React.Fragment>
      <GuiProvider
        windows_list={windows_map}
        on_add_window={name => add_window(name)}
      >
        <ProtocolProvider settings={context_settings}>
          <Navigation />
          <div className="main-window-content">
            <GoldenLayoutComponent
              ref={ref_golden_layout}
              htmlAttrs={{
                style: {
                  display: "inline-block",
                  position: "fixed",
                  height: "100%",
                  width: "100%"
                }
              }}
              config={{
                content: [
                  {
                    type: "row",
                    isClosable: false,
                    content: []
                  }
                ]
              }}
              registerComponents={myLayout => {
                for (const [window_name, values] of Object.entries(windows_map))
                  myLayout.registerComponent(window_name, values.class);
              }}
            />
          </div>
        </ProtocolProvider>
      </GuiProvider>
    </React.Fragment>
  );
}

export default Gui;
