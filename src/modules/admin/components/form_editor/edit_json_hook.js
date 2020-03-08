import React from "react";
import Util from "../../../../framework/util";

function useEditJson(props) {
  const [state_current_form, set_state_current_form] = React.useState({});
  const [state_last_message, set_state_last_message] = React.useState("");
  const [state_data_changed, set_state_data_changed] = React.useState("false");

  const update_last_message = message => {
    set_state_last_message(`"[${Util.get_time_hms()}] ${message}"`);
  };

  return {
    hook_last_message: state_last_message,
    hook_current_form: state_current_form,
    hook_data_changed: state_data_changed,
    hook_edit_json_fn: {
      set_current_form: current_form => {
        set_state_current_form(Util.shallow_copy(current_form));
        set_state_data_changed(false);
      },
      on_update: (key, keyPath, deep, oldValue, newValue) => {
        const current_form = { ...state_current_form };

        if (deep === 0 && newValue !== "") {
          if (key === "name") {
            current_form[key] = newValue;
            set_state_current_form(current_form);
            set_state_data_changed(true);
            return new Promise(resolve => resolve());
          }
        }

        update_last_message(`(Error) Update key[${key}] is not allowed`);
      },
      on_remove: (key, keyPath, deep, oldValue) => {
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
          set_state_data_changed(true);
          return new Promise(resolve => resolve());
        }
      },
      on_add: (key, keyPath, deep, newValue) => {
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
          set_state_data_changed(true);
          return new Promise(resolve => resolve());
        }
      },
      on_delta_update: data => {
        const { type, key, oldValue, newValue } = data;

        update_last_message(
          `[${type}] key[${key}] old_value[${oldValue}] new_value[${newValue}]`
        );
      }
    }
  };
}

export default useEditJson;
