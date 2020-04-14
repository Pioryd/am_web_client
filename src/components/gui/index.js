import React from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";

import { GoldenLayoutComponent } from "../layout/goldenLayoutComponent";

import { AppContext } from "../../context/app";

import ProtocolProvider from "../../context/protocol";
import GuiProvider from "../../context/gui";

import Navigation from "../navigation";

import RootWindows from "../windows";

import WorldAdmin from "../../modules/admin";
import WorldCharacter from "../../modules/world_character";

import "./index.css";

const DEFAULT_CONFIG = {
  content: [
    {
      type: "row",
      isClosable: false,
      content: []
    }
  ]
};

// Windows map
let module_windows_map = {};
module_windows_map["admin"] = WorldAdmin.windows_map;
module_windows_map["world_character"] = WorldCharacter.windows_map;

function Gui(props) {
  const hook_is_desktop_or_laptop = useMediaQuery({ minWidth: 992 });
  const [
    state_is_desktop_or_laptop,
    set_state_is_desktop_or_laptop
  ] = React.useState(false);
  const [state_windows_config, set_state_windows_config] = React.useState(null);
  const [state_windows_map] = React.useState({
    ...RootWindows.windows_map,
    ...module_windows_map[props.login_data.module]
  });

  // In this file use [get_merged_settings] instead of [context_settings]
  // For more info go to: [get_merged_settings]
  const { context_settings, context_set_settings } = React.useContext(
    AppContext
  );

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
        title: state_windows_map[window_name].title,
        type: "react-component",
        component: window_name,
        props: {
          id: { window_name },
          key: window_name,
          title: state_windows_map[window_name].title
        }
      });
    } else {
      if (root.contentItems[0].contentItems.length === 0) {
        root.contentItems[0].addChild({ type: "stack" });
      }

      root.contentItems[0].contentItems[0].addChild({
        title: state_windows_map[window_name].title,
        type: "react-component",
        component: window_name,
        props: {
          id: { window_name },
          key: window_name,
          title: state_windows_map[window_name].title
        }
      });
    }
  };

  // In this file use [get_merged_settings] instead of [context_settings]
  // Because most functionality need [context_settings] at initialization, when
  // is not merged yet(merge in useEffect is after first render-initialization),
  // so we have to force it.
  const get_merged_settings = () => {
    return { ...context_settings, ...props.login_data };
  };

  const get_saved_states = () => {
    let saved_states = localStorage.getItem("saved_states");
    try {
      if (saved_states != null) return JSON.parse(saved_states);
    } catch (e) {
      localStorage.removeItem("saved_states");
    }
  };

  React.useEffect(() => {
    // Set login_data
    context_set_settings(get_merged_settings());

    // Set GUI
    const load_windows_config = () => {
      let config = DEFAULT_CONFIG;
      let saved_states = get_saved_states();

      if (saved_states != null) {
        const saved_state = saved_states[get_merged_settings().id];
        if (
          saved_state != null &&
          props.login_data.id === saved_state.login_data_id &&
          saved_state.config.content.length > 0
        )
          config = saved_state.config;
      }

      return config;
    };
    const set_desktop_or_laptop = windows_config => {
      let is_desktop_or_laptop = hook_is_desktop_or_laptop;

      if (!("content" in windows_config.content[0])) {
        windows_config.content[0].content = DEFAULT_CONFIG.content;
      }

      if (windows_config.content[0].content.length > 0) {
        is_desktop_or_laptop =
          windows_config.content[0].content[0].type === "row";
      }

      set_state_is_desktop_or_laptop(is_desktop_or_laptop);
      return windows_config;
    };
    let windows_config = load_windows_config();
    windows_config = set_desktop_or_laptop(windows_config);

    set_state_windows_config(windows_config);
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
          {`[${get_merged_settings().module}]<${
            get_merged_settings().accept_connection_data.login
          }> - AM`}
        </title>
      </Helmet>
      <GuiProvider
        windows_list={state_windows_map}
        on_add_window={name => add_window(name)}
      >
        <ProtocolProvider settings={get_merged_settings()}>
          <Navigation />
          <div className="main-window-content">
            {state_windows_config != null && (
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
                config={state_windows_config}
                registerComponents={myLayout => {
                  for (const [window_name, values] of Object.entries(
                    state_windows_map
                  ))
                    myLayout.registerComponent(window_name, values.class);

                  myLayout.on("stateChanged", function() {
                    if (myLayout.isInitialised) {
                      const login_data_id = get_merged_settings().id;
                      const saved_state = {
                        config: myLayout.toConfig(),
                        login_data_id
                      };

                      let saved_states = get_saved_states() || {};
                      saved_states[login_data_id] = saved_state;
                      localStorage.setItem(
                        "saved_states",
                        JSON.stringify(saved_states)
                      );
                    }
                  });
                }}
              />
            )}
          </div>
        </ProtocolProvider>
      </GuiProvider>
    </React.Fragment>
  );
}

export default Gui;
