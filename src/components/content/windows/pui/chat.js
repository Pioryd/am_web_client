import React from "react";
import { AppContext } from "../../../../context/app";
import Util from "../../../../framework/util";

function Chat() {
  const {
    context_chat_received_message,
    context_clear_chat_received_message,
    context_send_message
  } = React.useContext(AppContext);
  const [state_messages, set_state_messages] = React.useState([]);
  const [state_input_value, set_state_input_value] = React.useState("");

  const send_message = () => {
    context_send_message(0, 0, state_input_value);

    let messages = [...state_messages];
    messages.unshift(
      `Player send[${Util.get_time_hms()}]: ${state_input_value}`
    );
    set_state_messages(messages);
  };

  const clear_messages = () => {
    set_state_messages([]);
  };

  React.useEffect(() => {
    if (
      context_chat_received_message === undefined ||
      context_chat_received_message === ""
    )
      return;

    let messages = [...state_messages];
    messages.unshift(
      `Player send[${Util.get_time_hms()}]: ${context_chat_received_message}`
    );
    set_state_messages(messages);
    context_clear_chat_received_message();
  }, [context_chat_received_message]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar">
          <input
            type="text"
            value={state_input_value}
            onChange={e => {
              set_state_input_value(e.target.value);
            }}
          ></input>
          <button onClick={send_message}>send</button>
          <button onClick={clear_messages}>clear</button>
        </div>
        <div>
          {state_messages.map(msg => {
            return <p>{msg}</p>;
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Chat;
