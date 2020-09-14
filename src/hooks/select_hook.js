import React from "react";

function useSelectHook(props) {
  const [state_options, set_state_options] = React.useState([]);
  const [state_selected_option, set_state_selected_option] = React.useState(
    props.default_value
  );
  const [state_current_value, set_state_current_value] = React.useState({});
  const [state_new_created, set_state_new_created] = React.useState({});

  // Handle select
  React.useEffect(() => {
    const options = state_options;
    let current_value = props.default_value;

    if (state_selected_option != null) {
      const label = state_selected_option.label;
      for (const option of options) {
        if (option.label === label) current_value = option.value;
      }
    }
    set_state_current_value(current_value);
  }, [state_selected_option]);

  return {
    hook_select_new_created: state_new_created,
    hook_select_current_value: state_current_value,
    hook_select_options: state_options,
    hook_select_selected_option: state_selected_option,
    hook_select_fn: {
      on_change: (option, { action }) => {
        if (action === "create-option") {
          set_state_new_created({ value: option.value });
        } else {
          set_state_selected_option(option);
        }
      },
      update: (data_map, current_object) => {
        let options = [];
        let current_value = {};
        let selected_option = "";

        for (const data of Object.values(data_map)) {
          const option = {
            label: props.create_label(data),
            value: data
          };
          if (data._color != null) option.color = data._color;
          options.push(option);
        }

        for (const option of options) {
          if (option.value === current_object) {
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
