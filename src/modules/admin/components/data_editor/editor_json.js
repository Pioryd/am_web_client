import React from "react";
import SourceEditor from "../source_editor";

import Ajv from "ajv";
import Util from "../../../../framework/util";

function EditorJSON(props) {
  const parse = (source, rules) => {
    let object = null;
    eval("object=" + source);

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(rules);
    const valid = validate(Util.shallow_copy(object));
    if (!valid) throw new Error("AJV:" + ajv.errorsText(validate.errors));

    return object;
  };

  const format = (source, mode) => {
    let object = null;

    if (mode === "javascript") eval("object=" + source);
    else object = JSON.parse(source);

    return JSON.stringify(object, null, 2);
  };

  const create_label = (object) => {
    return object.id;
  };

  const object_to_source = (object) => {
    return JSON.stringify(object, null, 2);
  };

  return (
    <SourceEditor
      protocol_ext_name={props.type}
      parse={parse}
      format={format}
      create_label={create_label}
      object_to_source={object_to_source}
      editor_options={{
        modes: ["json", "javascript"],
        default_mode: "json"
      }}
    />
  );
}

export default EditorJSON;
