import React from "react";
import SourceEditor from "../source_editor";
import yaml from "js-yaml";
import Ajv from "ajv";
import _ from "lodash";

function EditorYAML(props) {
  const parse = (source) => {
    let object = yaml.safeLoad(source);

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(props.rules);
    const valid = validate(_.cloneDeep(object));
    if (!valid) throw new Error("AJV:" + ajv.errorsText(validate.errors));

    return object;
  };

  const format = (source, mode) => {
    return yaml.safeDump(yaml.safeLoad(source), {
      flowLevel: 3,
      noArrayIndent: true
    });
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
        modes: ["yaml"],
        default_mode: "yaml"
      }}
    />
  );
}

export default EditorYAML;
