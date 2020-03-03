import React from "react";
import { JsonTree } from "react-editable-json-tree";
import Util from "../../../../framework/util";

import "./index.css";

function FormEditor() {
  const [state_current_form, set_state_current_form] = React.useState("");
  const [state_last_action, set_state_last_action] = React.useState("");

  React.useEffect(() => {}, []);

  const on_delta_update = data => {
    const { type, key, oldValue, newValue } = data;

    update_last_message(
      `[${type}] key[${key}] old_value[${oldValue}] new_value[${newValue}]`
    );
  };

  const on_add = (key, keyPath, deep, newValue) => {
    const current_form = { ...state_current_form };

    const add = () => {
      const keysPaths = ["rules", "scripts"];
      const form_key = keyPath[0];

      if (deep !== 1) return false;
      if (!keysPaths.includes(form_key)) return false;
      if (form_key === "scripts" && current_form.scripts.includes(newValue))
        return false;

      current_form[form_key].push(newValue);
      return true;
    };

    if (add() === false) {
      update_last_message(`(Error) Add key[${key}] is not allowed`);
    } else {
      set_state_current_form(current_form);
      return new Promise(resolve => resolve());
    }
  };

  const on_remove = (key, keyPath, deep, oldValue) => {
    const current_form = { ...state_current_form };

    const add = () => {
      const keysPaths = ["rules", "scripts"];
      const form_key = keyPath[0];

      if (deep !== 1) return false;
      if (!keysPaths.includes(form_key)) return false;

      for (const it_key in current_form[form_key]) {
        if (it_key === oldValue) {
          current_form[form_key].splice(
            current_form[form_key].indexOf(it_key),
            1
          );
          break;
        }

        return true;
      }
    };

    if (add() === false) {
      update_last_message(`(Error) Remove key[${key}] is not allowed`);
    } else {
      set_state_current_form(current_form);
      return new Promise(resolve => resolve());
    }
  };

  const on_update = (key, keyPath, deep, oldValue, newValue) => {
    const current_form = { ...state_current_form };

    if (deep === 0 && newValue !== "") {
      if (key === "name") {
        current_form[key] = newValue;
        set_state_current_form(current_form);
        return new Promise(resolve => resolve());
      }
    }

    update_last_message(`(Error) Update key[${key}] is not allowed`);
  };

  const update_last_message = message => {
    set_state_last_action(`"[${Util.get_time_hms()}] ${message}"`);
  };

  const load_form = () => {
    const test_json = {
      name: "Live",
      id: "Live_ID",
      rules: ["id_0", "id_1", "id_2"],
      scripts: ["script_0", "script_1", "script_2"]
    };
    update_last_message("Form loaded");
    set_state_current_form(test_json);
  };

  return (
    <div className="content_body">
      <div className="bar">
        <button onClick={load_form}>Load form</button>
        <label>{state_last_action}</label>
      </div>
      <div className="form_editor">
        {state_current_form === "" ? (
          <p>No form selected</p>
        ) : (
          <JsonTree
            rootName="state_settings"
            data={state_current_form}
            onDeltaUpdate={on_delta_update}
            beforeAddAction={on_add} // todo
            beforeRemoveAction={on_remove}
            beforeUpdateAction={on_update}
            isCollapsed={() => {
              return false;
            }}
          />
        )}
      </div>
    </div>
  );
}

export default FormEditor;
