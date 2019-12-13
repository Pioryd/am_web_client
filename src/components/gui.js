import React from "react";
import { GoldenLayoutComponent } from "./layout/goldenLayoutComponent";

import GuiProvider from "./gui_context";
import Navigation from "./navigation";
import PUI from "./content/windows/pui";

function Gui() {
  let ref_gl = React.createRef();

  const windows_titles_map = {
    pui: { title: "pui" }
  };

  const helper = {
    get_layout_root: () => {
      if (
        ref_gl !== null &&
        ref_gl.current !== null &&
        ref_gl.current.goldenLayoutInstance !== undefined &&
        ref_gl.current.goldenLayoutInstance.root !== null
      )
        return ref_gl.current.goldenLayoutInstance.root;
      else return null;
    },
    get_layout_instance: () => {
      if (
        ref_gl !== null &&
        ref_gl.current !== null &&
        ref_gl.current.goldenLayoutInstance !== undefined
      )
        return ref_gl.current.goldenLayoutInstance;
      else return null;
    }
  };

  const add_window = (window_name, content_ui) => {
    const root = helper.get_layout_root();
    if (root == null) return;

    root.contentItems[0].addChild({
      title: "A react component",
      type: "react-component",
      component: window_name,
      props: {
        id: { window_name },
        key: window_name,
        title: windows_titles_map[window_name].title
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
        windows_list={windows_titles_map}
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
                  content: []
                }
              ]
            }}
            registerComponents={myLayout => {
              myLayout.registerComponent("pui", PUI);
            }}
          />
        </div>
      </GuiProvider>
    </React.Fragment>
  );
}

export default Gui;
