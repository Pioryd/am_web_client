import React from "react";
import ReactJson from "react-json-view";
import { AppContext } from "../../../../context/app";

const theme = { light: "summerfruit:inverted", dark: "summerfruit" };

function Statistics() {
  const {
    context_admin,
    context_data_full,
    context_data_character,
    context_data_world
  } = React.useContext(AppContext);

  const [state_data_full, set_state_data_full] = new React.useState();

  const on_edit = ({
    updated_src,
    name,
    namespace,
    new_value,
    existing_value
  }) => {
    console.log(updated_src, name, namespace, new_value, existing_value);
  };

  React.useEffect(() => {
    set_state_data_full(context_data_full);
  }, [
    context_admin,
    context_data_full,
    context_data_character,
    context_data_world
  ]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar"></div>
        {context_admin ? (
          <React.Fragment>
            <p>Full data</p>
            <ReactJson
              src={state_data_full}
              theme={theme.dark}
              indentWidth={2}
              onEdit={on_edit}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p>Character data</p>
            <ReactJson
              src={context_data_character}
              theme={theme.dark}
              indentWidth={2}
              onEdit={on_edit}
            />
            <p>World data</p>
            <ReactJson
              src={context_data_world}
              theme={theme.dark}
              indentWidth={2}
              onEdit={on_edit}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

export default Statistics;
