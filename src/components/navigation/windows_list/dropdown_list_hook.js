import React from "react";

function useDropdownListHook(props) {
  const styles = {
    enabled: { display: "block" },
    disabled: { display: "none" }
  };

  const [state_enabled, set_state_enabled] = React.useState(props.enabled);

  return {
    attr: { style: state_enabled ? styles.enabled : styles.disabled },
    toggle: () => {
      set_state_enabled(!state_enabled);
    }
  };
}

export default useDropdownListHook;
