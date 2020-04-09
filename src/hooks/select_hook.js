import React from "react";

function useSelectHook(props) {
  const [state_options, set_state_options] = React.useState([]);
  const [state_selected_option, set_state_selected_option] = React.useState(
    props.default_value
  );
  const [state_current_value, set_state_current_value] = React.useState({});

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
    hook_select_current_value: state_current_value,
    hook_select_options: state_options,
    hook_select_selected_option: state_selected_option,
    hook_select_fn: {
      on_change: option => {
        set_state_selected_option(option);
      },
      update: (json_data_map, current_id) => {
        let options = [];
        let current_value = {};
        let selected_option = "";

        for (const json_data of Object.values(json_data_map))
          options.push({
            label: props.create_label(json_data),
            value: json_data
          });

        for (const option of options) {
          if (option.value.id === current_id) {
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
