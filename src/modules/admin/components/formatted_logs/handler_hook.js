import React from "react";
import { v4 as uuidv4 } from "uuid";

function useHandler(props) {
  const [state_messages, set_state_messages] = React.useState([]);

  return {
    hook_formatted_logs: state_messages,
    hook_formatted_logs_fn: {
      add: ({ type, text, date = new Date() }) => {
        const messages = [...state_messages];

        const key = uuidv4();
        messages.push({ key, type, text, date });
        messages.sort(function (a, b) {
          return b.date - a.date;
        });

        set_state_messages(messages);
      },
      remove_message: (key) =>
        set_state_messages([...state_messages.filter((el) => el.key !== key)]),
      clear: () => set_state_messages([])
    }
  };
}

export default useHandler;
