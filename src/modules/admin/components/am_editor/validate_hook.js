import React from "react";
import Util from "../../../../framework/util";
import Validator from "../../../../framework/validator";

const RULES = {
  id: {
    type: "string",
    required: true,
    empty: false
  },
  name: {
    type: "string",
    required: true,
    empty: false
  },
  rules: {
    type: "array",
    required: true,
    object_type: "object",
    object_rules: {
      type: { type: "string", empty: false },
      triggers: {
        type: "array",
        required: true,
        object_type: "object",
        object_empty: false,
        object_rules: {
          priority: { type: "number", empty: false },
          value: { type: ["number", "string", "boolean"], empty: false },
          min: { type: "number", empty: false },
          max: { type: "number", empty: false }
        }
      },
      actions: {
        type: "array",
        required: true,
        object_type: "string",
        object_empty: false
      }
    }
  },
  scripts: {
    type: "array",
    required: true,
    object_type: "string"
  }
};

function useValidate(props) {
  const [state_validator] = React.useState(new Validator(RULES));
  const [state_mode] = React.useState(props.mode);
  const [state_last_error, set_state_last_error] = React.useState("");

  const update_last_error = message => {
    if (message === "") set_state_last_error("");
    else set_state_last_error(`"[${Util.get_time_hms()}] ${message}"`);
  };

  const validate = {
    form: object => {
      state_validator.validate(object);
    }
  };

  return {
    hook_validate_last_error: state_last_error,
    hook_validate_fn: {
      clear_last_error: () => set_state_last_error(""),
      validate: object => {
        try {
          validate[state_mode](Util.shallow_copy(object));
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
