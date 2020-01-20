import React from "react";

import Gui from "./components/gui";
import AppProvider from "./context/app";

function App() {
  return <AppProvider> {<Gui />}</AppProvider>;
}

export default App;
