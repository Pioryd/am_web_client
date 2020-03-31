import React from "react";
import Util from "../../../../framework/util";
import Ajv from "ajv";

function useValidate(props) {
  const [state_rules, set_state_rules] = React.useState({});
  const [state_last_error, set_state_last_error] = React.useState("Initialize");

  const update_last_error = message => {
    if (message !== "")
      set_state_last_error(`"[${Util.get_time_hms()}] ${message}"`);
  };

  return {
    hook_validate_last_error: state_last_error,
    hook_validate_fn: {
      set_rules: rules => set_state_rules(rules),
      validate: object => {
        const ajv = new Ajv({ allErrors: true });
        const validate = ajv.compile(state_rules);
        const valid = validate(Util.shallow_copy(object));

        if (!valid) {
          update_last_error("AJV:" + ajv.errorsText(validate.errors));
          return false;
        }
        return true;
      }
    }
  };
}

export default useValidate;
