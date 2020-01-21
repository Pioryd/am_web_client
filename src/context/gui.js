import React from "react";

export const GuiContext = React.createContext();

function GuiProvider({ windows_list, on_add_window, children }) {
  const [
    state_clicked_point_name,
    set_state_clicked_point_name
  ] = React.useState("");

  const value = {
    context_windows_list: windows_list,
    context_on_add_window: on_add_window,
    context_clicked_point_name: state_clicked_point_name,
    context_set_clicked_point_name: set_state_clicked_point_name
  };

  return <GuiContext.Provider value={value}>{children}</GuiContext.Provider>;
}

export default GuiProvider;
