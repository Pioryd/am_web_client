import React from "react";

import Gui from "./components/gui";
import BotsManager from "./components/bots_manager";
import AppProvider from "./context/app";

function App() {
  return (
    <AppProvider>
      {
        <React.Fragment>
          <Gui /> <BotsManager />
        </React.Fragment>
      }
    </AppProvider>
  );
}

export default App;
