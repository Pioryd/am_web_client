import React from "react";

import Util from "../../../../framework/util";

import "./index.css";

const CONSOLE_LOGS_HEIGHT = "100px";

function List(props) {
  const [state_logs, set_state_logs] = React.useState([]);
  const [state_logs_height, set_state_logs_height] = React.useState(
    CONSOLE_LOGS_HEIGHT
  );

  const update_displayed_log = (messages) => {
    const display_logs = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const text_time = Util.get_time_hms(message.date);

      display_logs.push(
        <div className="Y4l_log_element" key={text_time + i}>
          <pre>{`[${text_time}] (${message.type}) ${message.text}`}</pre>
        </div>
      );
    }

    set_state_logs(display_logs);
  };

  const resize_logs = () => {
    let logs_height = state_logs_height;
    if (logs_height === CONSOLE_LOGS_HEIGHT) logs_height = "100%";
    else logs_height = CONSOLE_LOGS_HEIGHT;

    set_state_logs_height(logs_height);
  };

  const show_hide = () => {
    let logs_height = state_logs_height;
    if (logs_height === "0px") logs_height = CONSOLE_LOGS_HEIGHT;
    else logs_height = "0px";

    set_state_logs_height(logs_height);
  };

  React.useEffect(() => {
    update_displayed_log(props.hook_formatted_logs);
  }, [props.hook_formatted_logs]);

  return (
    <React.Fragment>
      <div className="mU9_bar">
        <button onClick={props.hook_formatted_logs_fn.clear}>clear</button>
        <button onClick={resize_logs}>resize</button>
        <button onClick={show_hide}>show/hide</button>
      </div>
      <div
        className="mU9_bar"
        style={{ height: state_logs_height, overflow: "auto" }}
      >
        {state_logs}
      </div>
    </React.Fragment>
  );
}

export default List;
