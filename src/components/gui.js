import React from "react";
import { GoldenLayoutComponent } from "../components/layout/goldenLayoutComponent";

import GuiProvider from "../context/gui";
import Navigation from "../components/navigation";
import ViewData from "../components/content/windows/pui/view_data";
import ViewSource from "../components/content/windows/pui/view_source";
import Settings from "../components/content/windows/settings";
import Chat from "../components/content/windows/pui/chat";
import EditData from "./content/windows/pui/edit_data";
import VirtualWorld from "../components/content/windows/pui/virtual_world";

function Gui() {
  let ref_gl = React.createRef();

  const windows_map = {
    settings: { class: Settings, title: "Client settings" },
    view_data: { class: ViewData, title: "View data" },
    view_source: { class: ViewSource, title: "View source" },
    chat: { class: Chat, title: "Chat" },
    edit_data: { class: EditData, title: "Edit data" },
    virtual_world: { class: VirtualWorld, title: "Virtual world" }
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
                    {
                      title: "edit_data",
                      type: "react-component",
                      component: "edit_data",
                      props: {
                        id: "edit_data",
                        key: "edit_data",
                        title: "edit_data"
                      }
                    },
                    {
                      title: "view_data",
                      type: "react-component",
                      component: "view_data",
                      props: {
                        id: "view_data",
                        key: "view_data",
                        title: "view_data"
                      }
                    },
                    {
                      title: "view_source",
                      type: "react-component",
                      component: "view_source",
                      props: {
                        id: "view_source",
                        key: "view_source",
                        title: "view_source"
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
