import React from "react";

import Util from "../../../../framework/util";

function List(props) {
  const [state_logs, set_state_logs] = React.useState([]);

  const update_displayed_log = messages => {
    const display_logs = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const text_time = Util.get_time_hms(message.date);

      display_logs.push(
        <div
          key={text_time + i}
        >{`[${text_time}] (${message.type}): ${message.text}`}</div>
      );
    }

    set_state_logs(display_logs);
  };

  React.useEffect(() => {
    update_displayed_log(props.logs);
  }, [props.logs]);

  return <div>{state_logs}</div>;
}

export default List;
