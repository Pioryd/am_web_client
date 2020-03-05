import React from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";

import Util from "../../framework/util";

import { GoldenLayoutComponent } from "../layout/goldenLayoutComponent";

import { AppContext } from "../../context/app";

import ProtocolProvider from "../../context/protocol";
import GuiProvider from "../../context/gui";

import Navigation from "../navigation";

import Settings from "../windows/settings";

import WorldAdmin from "../../modules/admin";
import WorldCharacter from "../../modules/world_character";

import "./index.css";

let ModuleWindowsMap = [];
const module_name = Util.get_formated_url_path().module;
if (module_name === "admin") {
  ModuleWindowsMap = WorldAdmin.windows_map;
} else if (module_name === "world_character") {
  ModuleWindowsMap = WorldCharacter.windows_map;
}

const load_windows_config = () => {
  let config = {
    content: [
      {
        type: "row",
        isClosable: false,
        content: []
      }
    ]
  };

  const saved_state = localStorage.getItem("saved_state");

  if (saved_state !== null && module_name === saved_state.module_name)
    config = JSON.parse(saved_state.config);

  return config;
};
const windows_config = load_windows_config();

function Gui() {
  const hook_is_desktop_or_laptop = useMediaQuery({ minWidth: 992 });
  const [
    state_is_desktop_or_laptop,
    set_state_is_desktop_or_laptop
  ] = React.useState(false);
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

    if (state_is_desktop_or_laptop) {
      if (root.contentItems[0].contentItems.length === 0) {
        root.contentItems[0].addChild({
          type: "row",
          content: [{ type: "column" }, { type: "column" }, { type: "column" }]
        });
      }
      const column_0 = root.contentItems[0].contentItems[0].contentItems[0];
      const column_1 = root.contentItems[0].contentItems[0].contentItems[1];
      const column_2 = root.contentItems[0].contentItems[0].contentItems[2];

      let selected_column = column_0;
      if (column_0.contentItems.length > column_1.contentItems.length)
        selected_column = column_1;
      else if (column_1.contentItems.length > column_2.contentItems.length)
        selected_column = column_2;

      selected_column.addChild({
        title: windows_map[window_name].title,
        type: "react-component",
        component: window_name,
        props: {
          id: { window_name },
          key: window_name,
          title: windows_map[window_name].title
        }
      });
    } else {
      if (root.contentItems[0].contentItems.length === 0) {
        root.contentItems[0].addChild({ type: "stack" });
      }

      root.contentItems[0].contentItems[0].addChild({
        title: windows_map[window_name].title,
        type: "react-component",
        component: window_name,
        props: {
          id: { window_name },
          key: window_name,
          title: windows_map[window_name].title
        }
      });
    }
  };

  React.useEffect(() => {
    const set_desktop_or_laptop = () => {
      let is_desktop_or_laptop = hook_is_desktop_or_laptop;

      if (windows_config.content[0].content.length > 0) {
        is_desktop_or_laptop =
          windows_config.content[0].content[0].type === "row";
      }

      set_state_is_desktop_or_laptop(is_desktop_or_laptop);
    };
    set_desktop_or_laptop();
  }, []);

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
      <Helmet>
        <title>
          {`[${context_settings.module}]<${context_settings.login}> - AM`}
        </title>
      </Helmet>
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
              config={windows_config}
              registerComponents={myLayout => {
                for (const [window_name, values] of Object.entries(windows_map))
                  myLayout.registerComponent(window_name, values.class);

                myLayout.on("stateChanged", function() {
                  if (myLayout.isInitialised) {
                    var state = JSON.stringify(myLayout.toConfig());
                    localStorage.setItem("saved_state", {
                      config: state,
                      module_name
                    });
                  }
                });
              }}
            />
          </div>
        </ProtocolProvider>
      </GuiProvider>
    </React.Fragment>
  );
}

export default Gui;
