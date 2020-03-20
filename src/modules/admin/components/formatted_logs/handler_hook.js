import React from "react";

function useHandler(props) {
  const [state_messages, set_state_messages] = React.useState([]);

  return {
    hook_formatted_logs: state_messages,
    hook_formatted_logs_fn: {
      add: ({ type, text, date = new Date() }) => {
        const messages = [...state_messages];

        messages.push({ type, text, date });
        messages.sort(function(a, b) {
          return b.date - a.date;
        });

        set_state_messages(messages);
      },
      clear: () => set_state_messages([])
    }
  };
}

export default useHandler;
