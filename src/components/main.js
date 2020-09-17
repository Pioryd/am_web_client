import React from "react";

import Gui from "./gui";
import LoginPanel from "./login_panel";
import { AppContext } from "../context/app";
import ConnectionProvider from "../context/connection";
import Modules from "../modules";

function App() {
  const { context_app_session_data, context_app_session_id } = React.useContext(
    AppContext
  );

  return (
    <React.Fragment>
      {context_app_session_id == null ? (
        <LoginPanel />
      ) : (
        <ConnectionProvider
          parse_packet_hook={
            Modules[context_app_session_data._settings.module]
              .useParsePacketHook
          }
          settings={context_app_session_data._settings}
        >
          <Gui />
        </ConnectionProvider>
      )}
    </React.Fragment>
  );
}

export default App;
