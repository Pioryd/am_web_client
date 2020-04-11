import React from "react";
import SourceEditor from "../components/source_editor";

function AdminScriptsEditor() {
  const parse = (source, rules) => {
    let object = null;
    eval(`object = ${source}`);
    ["id", "type", "name", "desc", "args", "fn"].map(value => {
      if (!(value in object))
        throw new Error(`Object doesn't contains key[${value}]`);
    });
    return JSON.parse(
      JSON.stringify(object, (key, value) =>
        key === "fn" ? value.toString() : value
      )
    );
  };

  const format = (source, mode) => {
    return source;
  };

  const create_label = object => {
    return object.id + "_" + object.name;
  };

  const object_to_source = object => {
    const hash = "+@!)(%&#$%#*@$&@*#(&$!+@#$!)&$@+*!&$%*#%&+@$##!)$&@+&$!";
    const new_obj = { ...object };
    new_obj.fn = hash;
    let str = JSON.stringify(new_obj, null, 2);
    str = str.replace(`"${hash}"`, object.fn);
    return str;
  };

  return (
    <SourceEditor
      protocol_ext_name="admin_script"
      parse={parse}
      format={format}
      create_label={create_label}
      object_to_source={object_to_source}
      editor_options={{
        modes: ["javascript"],
        default_mode: "javascript"
      }}
    />
  );
}

export default AdminScriptsEditor;
