import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "./index.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function BasicLayout(props) {
  const [state_items] = React.useState(() => {
    const windows = [];
    for (const [i, window] of Object.entries(props.windows))
      windows.push(<div key={i}>{window}</div>);
    return windows;
  });

  return (
    <ResponsiveGridLayout {...props.config}>{state_items}</ResponsiveGridLayout>
  );
}

export default BasicLayout;
