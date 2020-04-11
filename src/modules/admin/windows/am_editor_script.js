import React from "react";
import SourceEditor from "../components/source_editor";

import AML from "../../../framework/aml";

function AM_ScriptEditor() {
  const parse = (source, rules) => {
    const object = AML.parse(source);
    object.source = source;
    return { id: object.id, source };
  };

  const format = (source, mode) => {
    return source;
  };

  const create_label = object => {
    const parsed = AML.parse(object.source);
    return object.id + "_" + parsed.name;
  };

  const object_to_source = object => {
    return object.source;
  };

  return (
    <SourceEditor
      protocol_ext_name="am_script"
      parse={parse}
      format={format}
      create_label={create_label}
      object_to_source={object_to_source}
      editor_options={{
        modes: ["elm", "text", "cirru", "ruby", "tcl"],
        default_mode: "tcl",
        default_source: "data"
      }}
    />
  );
}

export default AM_ScriptEditor;
