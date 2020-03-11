import React from "react";
import Util from "../../../../framework/util";

function useValidate(props) {
  const [state_mode] = React.useState(props.mode);
  const [state_last_error, set_state_last_error] = React.useState("");

  const update_last_error = message => {
    if (message === "") set_state_last_error("");
    else set_state_last_error(`"[${Util.get_time_hms()}] ${message}"`);
  };

  const validate = {
    form: object => {
      const keys_required = ["id", "name"];
      const additional_keys = ["rules", "scripts"];
      let error = "";

      for (const key of keys_required) {
        if (!("id" in object)) {
          error = `(Error) JSON must contains key[${key}].`;
          break;
        }
      }

      if (error !== "") {
        update_last_error(error);
        return false;
      }

      for (const key of Object.keys(object)) {
        if (keys_required.includes(key) && additional_keys.includes(key)) {
          error`(Error) JSON cant contains key[${key}]. Possible keys[${[
            ...keys_required,
            ...additional_keys
          ]}]`;
          break;
        }
      }

      if (error !== "") {
        update_last_error(error);
        return false;
      }

      return true;
    }
  };

  return {
    hook_validate_last_error: state_last_error,
    hook_validate: object => {
      try {
        return validate[state_mode](Util.shallow_copy(object));
      } catch (e) {
        console.log(e, object);
        update_last_error("Unable to parse object.");
        return false;
      }
    }
  };
}

export default useValidate;
