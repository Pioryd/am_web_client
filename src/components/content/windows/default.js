import React from "react";
import ReactJson from "react-json-view";
import { AppContext } from "../../../context/app_context";

function Default() {
  const theme = { light: "summerfruit:inverted", dark: "summerfruit" };
  const { context_source } = React.useContext(AppContext);
  const [state_theme, set_state_theme] = React.useState(theme.dark);
  const [state_source, set_state_source] = React.useState({});

  React.useEffect(() => {
    if (context_source !== undefined && "points" in context_source)
      set_state_source(context_source.points);
  }, [context_source]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar">{"Theme: " + state_theme}</div>
        <pre>
          <ReactJson src={state_source} theme={state_theme} />
        </pre>
      </div>
    </React.Fragment>
  );
}

export default Default;
