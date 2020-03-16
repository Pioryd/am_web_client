import React from "react";
import Util from "../../../../framework/util";
import Validator from "../../../../framework/validator";

function useValidate(props) {
  const [state_validator] = React.useState(new Validator(props.rules));
  const [state_last_error, set_state_last_error] = React.useState("");

  const update_last_error = message => {
    if (message === "") set_state_last_error("");
    else set_state_last_error(`"[${Util.get_time_hms()}] ${message}"`);
  };

  return {
    hook_validate_last_error: state_last_error,
    hook_validate_fn: {
      clear_last_error: () => set_state_last_error(""),
      validate: object => {
        try {
          state_validator.validate(Util.shallow_copy(object));
          return true;
        } catch (e) {
          update_last_error(e);
          return false;
        }
      }
    }
  };
}

export default useValidate;
