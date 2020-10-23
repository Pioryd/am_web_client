import React from "react";
import Util from "../../../../framework/util";

import "./index.css";

function List(props) {
  const [state_logs, set_state_logs] = React.useState([]);

  const update_displayed_log = (messages) => {
    const display_logs = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const text_time = Util.get_time_hms(message.date);

      display_logs.push(
        <div className="Y4l_log_element" key={message.key}>
          <pre>{`[${text_time}] (${message.type}) ${message.text}`}</pre>
          <button
            className="Y4l_remove_button"
            onClick={() =>
              props.hook_formatted_logs_fn.remove_message(message.key)
            }
          >
            [X]
          </button>
        </div>
      );
    }

    set_state_logs(display_logs);
  };

  React.useEffect(() => {
    update_displayed_log(props.hook_formatted_logs);
  }, [props.hook_formatted_logs]);

  return (
    <React.Fragment>
      <div className="Y4l_resizable">{state_logs}</div>
    </React.Fragment>
  );
}

export default List;
