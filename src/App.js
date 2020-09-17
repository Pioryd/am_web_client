import React from "react";

import Main from "./components/main";
import AppProvider from "./context/app";

function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}

export default App;
