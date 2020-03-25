import React from "react";
import Util from "../../../../framework/util";
import Validator from "../../../../framework/validator";

function useValidate(props) {
  const [state_validator, set_state_validator] = React.useState(
    new Validator({})
  );
  const [state_last_error, set_state_last_error] = React.useState("Initialize");

  const update_last_error = message => {
    if (message !== "")
      set_state_last_error(`"[${Util.get_time_hms()}] ${message}"`);
  };

  return {
    hook_validate_last_error: state_last_error,
    hook_validate_fn: {
      set_rules: rules => set_state_validator(new Validator(rules)),
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