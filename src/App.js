import React from "react";

import Gui from "./components/gui";
import AppProvider from "./context/app";
import Util from "./framework/util";

const args = Util.get_formated_url_path();
const correct_args =
  args.login != null &&
  args.password != null &&
  args.host != null &&
  args.port != null &&
  args.module != null;

const error_info = (
  <React.Fragment>
    <p>[ERROR] Wrong arguments. You need to put correct args. For example:</p>
    <p>
      http://localhost:3002/login:admin/password:123/host:localhost/port:3001/module:world_admin/client_timeout:0
    </p>
  </React.Fragment>
);

function App() {
  return <AppProvider> {correct_args ? <Gui /> : error_info}</AppProvider>;
}

export default App;
