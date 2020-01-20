import React from "react";
import { GoldenLayoutComponent } from "./layout/goldenLayoutComponent";

import GuiProvider from "../context/gui";
import Navigation from "./navigation";

import Settings from "./windows/settings";

import WorldAdmin from "../modules/world_admin";
import WorldCharacter from "../modules/world_character";

function Gui() {
  let ref_golden_layout = React.createRef();

  const windows_map = {
    settings: { class: Settings, title: "Client settings" },
    ...WorldAdmin.windows_map,
    ...WorldCharacter.windows_map
  };

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
        <Navigation> </Navigation>
        <div className="main-window-content">
          {" "}
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
      </GuiProvider>
    </React.Fragment>
  );
}

export default Gui;
