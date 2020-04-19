import React from "react";
import { GoldenLayoutComponent } from "../../layout/golden_layout/goldenLayoutComponent";

import "./index.css";

function GoldenLayout(props) {
  React.useEffect(() => props.golden_layout_fn.set_gui(), []);

  React.useLayoutEffect(() => {
    function updateSize() {
      const layout_instance = props.golden_layout_fn.get_layout_instance();
      if (layout_instance == null) return;

      layout_instance.updateSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <React.Fragment>
      {props.windows_config != null && (
        <GoldenLayoutComponent
          ref={props.golden_layout_ref}
          htmlAttrs={{
            style: {
              display: "inline-block",
              position: "fixed",
              height: "100%",
              width: "100%"
            }
          }}
          config={props.windows_config}
          registerComponents={props.golden_layout_fn.register_components}
        />
      )}
    </React.Fragment>
  );
}

export default GoldenLayout;
