import React from "react";
import Util from "../../../../../framework/util";
import { AppContext } from "../../../../../context/app";
import "./index.css";

function Chat(props) {
  const {
    context_packets_virtual_world,
    context_pop_packets_virtual_world,
    context_send_virtual_world,
    context_send_leave_virtual_world
  } = React.useContext(AppContext);

  const [state_messages, set_state_messages] = React.useState([]);
  const [state_display_messages, set_state_display_messages] = React.useState(
    []
  );
  const [
    state_virtual_world_data,
    set_state_virtual_world_data
  ] = React.useState([]);

  const ref_text_input = React.useRef();

  const update_displayed_message = () => {
    const messages = state_messages;

    const display_messages = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      if (message.received === true)
        display_messages.push(
          <div key={`received_${i}`} className="received">
            <div className="info">{`[${Util.get_time_hms(message.date)}] ${
              message.name
            }:`}</div>
            {message.text}
          </div>
        );
      else
        display_messages.push(
          <div key={`sended_${i}`} className="sended">
            <div className="info">{`[${Util.get_time_hms(
              message.date
            )}] You:`}</div>
            {message.text}
          </div>
        );
    }

    set_state_display_messages(display_messages);
  };

  const send_virtual_world = () => {
    const text = ref_text_input.current.value;
    const date = new Date();

    add_message({
      date: date,
      text: text,
      received: false
    });

    context_send_virtual_world({
      packet_id: "message",
      packet_data: text
    });

    ref_text_input.current.value = "";

    update_displayed_message();
  };

  const clear_messages = () => {
    set_state_messages([]);
  };

  const leave_virtual_world = () => {
    context_send_leave_virtual_world();
  };

  const add_message = ({ text, date, received }) => {
    const messages = state_messages;

    messages.push({ text, date, received });
    messages.sort(function(a, b) {
      return b.date - a.date;
    });

    set_state_messages(messages);
  };

  React.useEffect(() => {
    const received_messages = context_pop_packets_virtual_world();
    if (received_messages == null) return;

    for (const message of received_messages) {
      const { packet_id, packet_data } = message;
      if (packet_id === "data") {
        set_state_virtual_world_data(packet_data);
      } else if (packet_id === "message") {
        add_message({ ...packet_data, date: new Date(), received: true });
      }
    }

    update_displayed_message();
  }, [context_packets_virtual_world]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          <input
            ref={ref_text_input}
            key="console_input"
            type="text"
            onKeyDown={e => {
              if (e.key === "Enter") send_virtual_world();
            }}
          />
          <button onClick={send_virtual_world}>send</button>
          <button onClick={clear_messages}>clear</button>
          <button onClick={leave_virtual_world}>leave virtual world</button>
        </div>
        <div className="virtual_world">
          <div className="content">
            <div className="column_left">{state_display_messages}</div>
            <div className="column_right">{state_virtual_world_data}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Chat;
