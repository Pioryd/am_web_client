import React from "react";

function useSelectHook(props) {
  const [state_options, set_state_options] = React.useState([]);
  const [state_selected_option, set_state_selected_option] = React.useState("");
  const [state_current_value, set_state_current_value] = React.useState({});

  // Handle select
  React.useEffect(() => {
    const options = state_options;
    const label = state_selected_option.label;

    let current_value = {};
    for (const option of options) {
      if (option.label === label) current_value = option.value;
    }

    set_state_current_value(current_value);
  }, [state_selected_option]);

  return {
    hook_current_value: state_current_value,
    hook_select_options: state_options,
    hook_selected_option: state_selected_option,
    hook_select_fn: {
      on_change: option => {
        set_state_selected_option(option);
      },
      update: (forms, current_form_id) => {
        let options = [];
        let current_value = {};
        let selected_option = "";

        for (const form of Object.values(forms))
          options.push({ label: form.id + "_" + form.name, value: form });

        for (const option of options) {
          if (option.value.id === current_form_id) {
            selected_option = option;
            current_value = option.value;
            break;
          }
        }

        set_state_options(options);
        set_state_current_value(current_value);
        set_state_selected_option(selected_option);
      }
    }
  };
}

export default useSelectHook;
