import React from "react";
import SourceEditor from "../source_editor";
import js_beautify from "js-beautify";
import { ProtocolContext } from "../../../../context/protocol";

function EditorJS(props) {
  const { context_packets_fn } = React.useContext(ProtocolContext);

  const parse = (source, rules) => {
    let object = null;
    eval(`object = ${source}`);
    ["id", "type", "desc", "args", "fn"].map((value) => {
      if (!(value in object))
        throw new Error(`Object doesn't contains key[${value}]`);
    });
    return JSON.parse(
      JSON.stringify(object, (key, value) =>
        key === "fn" ? value.toString() : value
      )
    );
  };

  // For more options go to "js-beautify" file.
  // -> interface JsBeautifyOptions...
  // -> https://unibeautify.com/docs/option-wrap-line-length
  const format = (source, mode) => {
    for (let i = 0; i < 10; i++)
      source = js_beautify(source, {
        indent_size: 2,
        brace_style: "collapse-preserve-inline",
        indent_with_tabs: false,
        wrap_line_length: 80
      });
    return source;
  };

  const create_label = (object) => {
    return object.type + "@" + object.id;
  };

  const object_to_source = (object) => {
    const hash = "+@!)(%&#$%#*@$&@*#(&$!+@#$!)&$@+*!&$%*#%&+@$##!)$&@+&$!";
    const new_obj = { ...object };
    new_obj.fn = hash;
    let str = JSON.stringify(new_obj, null, 2);
    str = str.replace(`"${hash}"`, object.fn);
    return str;
  };

  return (
    <SourceEditor
      protocol_ext_name={props.type}
      parse={parse}
      format={format}
      create_label={create_label}
      object_to_source={object_to_source}
      editor_options={{
        modes: ["javascript"],
        default_mode: "javascript"
      }}
      additional_actions={[
        {
          name: "process",
          callback: (object) => {
            const action_id = Date.now() + "_process";
            context_packets_fn.send("process_admin_script", {
              action_id,
              source: object.fn
            });
          }
        }
      ]}
      additional_parse_protocols={["process_admin_script"]}
    />
  );
}

export default EditorJS;
