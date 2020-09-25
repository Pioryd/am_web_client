import React from "react";
import { GoldenLayoutComponent } from "../../layout/golden_layout/goldenLayoutComponent";
import ResizeObserver from "rc-resize-observer";

import "./index.css";

const BORDERS = 5;
const NAVIGATION_BAR_SIZE = 15;

function GoldenLayout(props) {
  const [state_need_resize, set_state_need_resize] = React.useState({});

  const updateSize = () => {
    const layout_instance = props.golden_layout_fn.get_layout_instance();
    if (layout_instance == null) return;

    const width =
      window.innerWidth && document.documentElement.clientWidth
        ? Math.min(window.innerWidth, document.documentElement.clientWidth)
        : window.innerWidth ||
          document.documentElement.clientWidth ||
          document.getElementsByTagName("body")[0].clientWidth;
    const height =
      window.innerHeight && document.documentElement.clientHeight
        ? Math.min(window.innerHeight, document.documentElement.clientHeight)
        : window.innerHeight ||
          document.documentElement.clientHeight ||
          document.getElementsByTagName("body")[0].clientHeight;

    layout_instance.updateSize(
      width - BORDERS,
      height - NAVIGATION_BAR_SIZE - BORDERS
    );
  };

  React.useLayoutEffect(() => updateSize(), []);
  React.useLayoutEffect(() => updateSize(), [state_need_resize]);

  React.useEffect(() => props.golden_layout_fn.set_gui(), []);

  return (
    <ResizeObserver onResize={() => set_state_need_resize({})}>
      <React.Fragment>
        {props.windows_config != null && (
          <GoldenLayoutComponent
            ref={props.golden_layout_ref}
            config={props.windows_config}
            registerComponents={props.golden_layout_fn.register_components}
          />
        )}
      </React.Fragment>
    </ResizeObserver>
  );
}

export default GoldenLayout;
