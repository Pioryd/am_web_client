import React from "react";

import Gui from "./gui";
import LoginPanel from "./login_panel";
import { AppContext } from "../context/app";

function App() {
  const { context_app_session_data, context_app_session_id } = React.useContext(
    AppContext
  );
  const [state_selected_gui, set_state_selected_gui] = React.useState(null);

  React.useEffect(() => {
    const { _settings } = context_app_session_data;

    if (context_app_session_id == null || _settings == null) return;

    if (["admin"].includes(_settings.module))
      set_state_selected_gui("multi_window");
    else if (["virtual_world"].includes(_settings.module))
      set_state_selected_gui("grid");
  }, [context_app_session_data]);

  return (
    <React.Fragment>
      {state_selected_gui == null ? (
        <LoginPanel />
      ) : (
        <Gui type={state_selected_gui} />
      )}
    </React.Fragment>
  );
}

export default App;
