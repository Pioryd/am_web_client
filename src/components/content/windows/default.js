import React from "react";
import ReactJson from "react-json-view";
import { AppContext } from "../../../context/app_context";

function Default() {
  const { context_source } = React.useContext(AppContext);
  const [state_source, set_state_source] = React.useState({});

  React.useEffect(() => {
    if (context_source !== undefined && "points" in context_source)
      set_state_source(context_source.points);
  }, [context_source]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar"></div>
        <pre>
          <ReactJson src={state_source} />
        </pre>
      </div>
    </React.Fragment>
  );
}

export default Default;
