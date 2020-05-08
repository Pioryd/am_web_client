import React from "react";
import SourceEditor from "../source_editor";

import AML from "../../../../framework/aml";

function EditorAML(props) {
  const parse = (source, rules, selected_data) => {
    AML.parse(selected_data.id, source);
    return { id: selected_data.id, source };
  };

  const format = (source, mode) => {
    return source;
  };

  const create_label = (object) => {
    return object.id;
  };

  const object_to_source = (object) => {
    return object.source;
  };

  return (
    <SourceEditor
      protocol_ext_name={props.type}
      parse={parse}
      format={format}
      create_label={create_label}
      object_to_source={object_to_source}
      editor_options={{
        modes: ["elm", "text", "cirru", "ruby", "tcl"],
        default_mode: "tcl"
      }}
    />
  );
}

export default EditorAML;
