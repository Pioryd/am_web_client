import React from "react";
import ReactJson from "react-json-view";
import { AppContext } from "../../../../context/app";

const theme = { light: "summerfruit:inverted", dark: "summerfruit" };

function Statistics() {
  const { context_source } = React.useContext(AppContext);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar"></div>
        <ReactJson src={context_source} theme={theme.dark} indentWidth={2} />
      </div>
    </React.Fragment>
  );
}

export default Statistics;
