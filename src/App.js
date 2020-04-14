import React from "react";

import Gui from "./components/gui";
import LoginPanel from "./components/login_panel";
import AppProvider from "./context/app";

function App() {
  const [state_login_data, set_state_login_data] = React.useState({});

  return (
    <AppProvider>
      {Object.keys(state_login_data).length > 0 ? (
        <Gui login_data={state_login_data} />
      ) : (
        <LoginPanel set_login_data={set_state_login_data} />
      )}
    </AppProvider>
  );
}

export default App;
