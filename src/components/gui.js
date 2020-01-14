import React from "react";
import { GoldenLayoutComponent } from "../components/layout/goldenLayoutComponent";

import GuiProvider from "../context/gui";
import Navigation from "../components/navigation";
import Statistics from "../components/content/windows/pui/statistics";
import Settings from "../components/content/windows/settings";
import Chat from "../components/content/windows/pui/chat";
import UserInterface from "../components/content/windows/pui/user_interface";
import VirtualWorld from "../components/content/windows/pui/virtual_world";

function Gui() {
  let ref_gl = React.createRef();

  const windows_map = {
    settings: { class: Settings, title: "[All] Settings" },
    statistics: { class: Statistics, title: "[All] Statistics" },
    chat: { class: Chat, title: "[User] Chat" },
    user_interface: { class: UserInterface, title: "[User] Edit data" },
    virtual_world: { class: VirtualWorld, title: "[User] Virtual world" }
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
                      title: "user_interface",
                      type: "react-component",
                      component: "user_interface",
                      props: {
                        id: "user_interface",
                        key: "user_interface",
                        title: "user_interface"
                      }
                    },
                    {
                      title: "virtual_world",
                      type: "react-component",
                      component: "virtual_world",
                      props: {
                        id: "virtual_world",
                        key: "virtual_world",
                        title: "virtual_world"
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
