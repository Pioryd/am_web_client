import React from "react";
import { GoldenLayoutComponent } from "../components/layout/goldenLayoutComponent";

import GuiProvider from "../context/gui";
import Navigation from "../components/navigation";

import Settings from "./content/windows/settings";

import ViewData from "./content/windows/pui/view_data";
import ViewSource from "./content/windows/pui/view_source";
import GraphicalUI from "./content/windows/pui/graphical_ui";
import Chat from "./content/windows/pui/chat";
import EditData from "./content/windows/pui/edit_data";
import VirtualWorld from "./content/windows/pui/virtual_world";

import RunScript from "./content/windows/admin/run_script";
import ScriptsList from "./content/windows/admin/scripts_list";

function Gui() {
  let ref_gl = React.createRef();

  const windows_map = {
    settings: { class: Settings, title: "Client settings" },
    view_data: { class: ViewData, title: "View data" },
    view_source: { class: ViewSource, title: "View source" },
    chat: { class: Chat, title: "Chat" },
    edit_data: { class: EditData, title: "Edit data" },
    virtual_world: { class: VirtualWorld, title: "Virtual world" },
    admin_run_script: { class: RunScript, title: "[Admin] Run script" },
    admin_scripts_list: { class: ScriptsList, title: "[Admin] Scripts list" },
    graphical_ui: { class: GraphicalUI, title: "[Admin] Graphical UI" }
  };

  const helper = {
    get_layout_root: () => {
      if (
        ref_gl != null &&
        ref_gl.current != null &&
        ref_gl.current.goldenLayoutInstance != null &&
        ref_gl.current.goldenLayoutInstance.root != null
      )
        return ref_gl.current.goldenLayoutInstance.root;
      else return null;
    },
    get_layout_instance: () => {
      if (
        ref_gl != null &&
        ref_gl.current != null &&
        ref_gl.current.goldenLayoutInstance != null
      )
        return ref_gl.current.goldenLayoutInstance;
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
          <GoldenLayoutComponent //config from simple react example: https://golden-layout.com/examples/#qZXEyv
            ref={ref_gl}
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
                  content: [
                    // {
                    //   title: "example",
                    //   type: "react-component",
                    //   component: "example",
                    //   props: {
                    //     id: "example",
                    //     key: "example",
                    //     title: "example"
                    //   }
                    // }
                    {
                      title: "graphical_ui",
                      type: "react-component",
                      component: "graphical_ui",
                      props: {
                        id: "graphical_ui",
                        key: "graphical_ui",
                        title: "graphical_ui"
                      }
                    }
                  ]
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
