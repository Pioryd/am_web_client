import React from "react";
import SourceEditor from "../components/source_editor";

import AML from "../../../framework/aml";

function AM_ScriptEditor() {
  const parse = source => {
    const object = AML.parse(source);
    object.source = source;
    return object;
  };

  const format = source => {
    return source;
  };

  return (
    <SourceEditor
      protocol_ext_name="am_script"
      parse={parse}
      format={format}
      create_label={object => {
        const parsed = parse(object.source);
        return object.id + "_" + parsed.name;
      }}
      editor_options={{
        modes: ["elm", "text", "cirru", "ruby", "tcl"],
        default_mode: "tcl",
        default_source: "data"
      }}
    />
  );
}

export default AM_ScriptEditor;
