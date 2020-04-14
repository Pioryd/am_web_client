import React from "react";

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state_settings, set_state_settings] = React.useState({
    accept_connection_data: {},
    main_loop_sleep: 500,
    reconnect_attempts_interval: 1000,
    packet_send_delay: 0,
    packet_timeout: 0,
    host: "localhost",
    port: "3000",
    module: "admin",
    start_as_connection_enabled: 1
  });

  const value = {
    context_settings: state_settings,
    context_set_settings: set_state_settings
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
