import React from "react";

import Gui from "./components/gui";
import LoginPanel from "./components/login_panel";
import AppProvider from "./context/app";

function App() {
  const [state_login_data, set_state_login_data] = React.useState({});
  const [state_selected_gui, set_state_selected_gui] = React.useState(null);

  React.useEffect(() => {
    if (["admin", "world_character"].includes(state_login_data.module))
      set_state_selected_gui("multi_window");
    else if (["virtual_world"].includes(state_login_data.module))
      set_state_selected_gui("grid");
  }, [state_login_data]);

  return (
    <AppProvider>
      {state_selected_gui == null ? (
        <LoginPanel set_login_data={set_state_login_data} />
      ) : (
        <Gui login_data={state_login_data} type={state_selected_gui} />
      )}

      {/* <Gui_Grid login_data={state_login_data} /> */}
    </AppProvider>
  );
}

export default App;
