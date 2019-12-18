import React from "react";
import ReactJson from "react-json-view";
import { AppContext } from "../../../../context/app";

const theme = { light: "summerfruit:inverted", dark: "summerfruit" };

function Settings() {
  const { context_settings, context_set_settings } = React.useContext(
    AppContext
  );
  const [state_settings, set_state_settings] = React.useState({});

  const onEdit = e => {
    context_set_settings(e.updated_src);
  };

  React.useEffect(() => {
    if (context_settings != null) set_state_settings(context_settings);
  }, [context_settings]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar"></div>
        <ReactJson
          src={state_settings}
          theme={theme.dark}
          indentWidth={2}
          onEdit={onEdit}
        />
      </div>
    </React.Fragment>
  );
}

export default Settings;
