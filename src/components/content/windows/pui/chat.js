import React from "react";
import { AppContext } from "../../../../context/app";

function Chat() {
  const {
    context_logged_as,
    context_received_messages,
    context_clear_received_messages,
    context_send_message
  } = React.useContext(AppContext);

  const [state_room, set_state_room] = React.useState({});
  const [state_send_messages, set_state_send_messages] = React.useState([]);
  const [state_display_messages, set_state_display_messages] = React.useState(
    []
  );
  const [state_input_value, set_state_input_value] = React.useState("");

  const create_room = (from_user, to_user) => {
    set_state_room({ from_user: from_user, to_user: to_user });
  };

  const update_displayed_message = () => {
    const messages = [...state_send_messages, ...context_received_messages];
    messages.sort((a, b) => {
      if (a.date > b.data) return 1;
      if (a.date < b.data) return -1;
      return 0;
    });

    const display_messages = [];

    for (const message of messages) {
      if (message.from_user === context_logged_as)
        display_messages.push(<div className="sender">message.message</div>);
      else
        display_messages.push(<div className="receiver">message.message</div>);
    }

    set_state_display_messages(display_messages);
  };

  const send_message = () => {
    let messages = [...state_send_messages];
    messages.push({
      date: new Date(),
      from_user: context_logged_as,
      message: state_input_value
    });
    set_state_send_messages(messages);

    context_send_message(0, 0, state_input_value);

    update_displayed_message();
  };

  const clear_messages = () => {
    set_state_send_messages([]);
    set_state_display_messages([]);
    context_clear_received_messages();

    update_displayed_message();
  };

  React.useEffect(() => {
    update_displayed_message();
  }, [context_received_messages]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar">
          <select
            value={state_input_value}
            onChange={e => {
              set_state_input_value(e.target.value);
            }}
          >
            <option value="grejpfrutowy">Grejpfrutowy</option>
            <option value="limonkowy">Limonkowy</option>
            <option value="kokosowy">Kokosowy</option>
            <option value="mango">Mango</option>
          </select>
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
        <div className="chat">{state_display_messages}</div>
      </div>
    </React.Fragment>
  );
}

export default Chat;
