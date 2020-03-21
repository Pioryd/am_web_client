import React from "react";
import Util from "../../../../framework/util";
import AML from "../../../../framework/aml";

function useValidate(props) {
  const [state_last_error, set_state_last_error] = React.useState("Initialize");

  const update_last_error = message => {
    if (message !== "")
      set_state_last_error(`"[${Util.get_time_hms()}] ${message}"`);
  };

  return {
    hook_validate_last_error: state_last_error,
    hook_validate_fn: {
      set_rules: rules => {},
      validate: source => {
        try {
          AML.parse(source);
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
