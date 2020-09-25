import React from "react";
import AceEditor from "react-ace";
import ResizeObserver from "rc-resize-observer";

function ResizableAceEditor(props) {
  const [state_editor_size_px, set_state_editor_size_px] = React.useState({
    width: "100px",
    height: "100px"
  });

  return (
    <ResizeObserver
      onResize={({ width, height }) =>
        set_state_editor_size_px({
          width: width + "px",
          height: height + "px"
        })
      }
    >
      <div style={{ height: "100%", width: "100%" }}>
        <AceEditor
          width={state_editor_size_px.width}
          height={state_editor_size_px.height}
          {...props}
        />
      </div>
    </ResizeObserver>
  );
}

export default ResizableAceEditor;
