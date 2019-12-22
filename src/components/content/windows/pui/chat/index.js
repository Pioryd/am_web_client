import React from "react";
import Util from "../../../../../framework/util";
import { AppContext } from "../../../../../context/app";
import useRooms from "./rooms_hook";
import "./index.css";
/*
Friends list

*/
function Chat(props) {
  const {
    context_data_character,
    context_received_messages,
    context_pop_received_messages,
    context_send_message
  } = React.useContext(AppContext);

  const {
    current_room,
    rooms_list,
    update_rooms,
    set_current_room,
    add_message,
    clear_room_messages
  } = useRooms();

  const [state_display_rooms, set_state_display_rooms] = React.useState([]);
  const [state_display_messages, set_state_display_messages] = React.useState(
    []
  );
  const [state_input_value, set_state_input_value] = React.useState("");

  const update_displayed_message = () => {
    const messages = [...current_room.messages];

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

  const update_displayed_rooms = () => {
    const rooms = { ...rooms_list };

    const display_rooms = [];

    for (const [room_name] of Object.entries(rooms))
      display_rooms.push(
        <button
          key={room_name}
          className="button"
          onClick={() => {
            set_current_room(room_name);
          }}
        >
          {room_name}
        </button>
      );

    set_state_display_rooms(display_rooms);
  };

  const send_message = () => {
    const text = state_input_value;
    const date = new Date();
    const name = current_room.name;

    add_message({
      name: name,
      date: date,
      text: text,
      received: false
    });

    context_send_message({
      name: name,
      text: text
    });

    set_state_input_value("");

    update_displayed_message();
  };

  const clear_messages = () => {
    clear_room_messages();

    update_displayed_message();
  };

  React.useEffect(() => {
    const received_messages = context_pop_received_messages();
    if (received_messages == null) return;

    for (const message of received_messages)
      add_message({ ...message, date: new Date(), received: true });

    update_displayed_message();
  }, [context_received_messages]);

  React.useEffect(() => {
    update_displayed_rooms();
    update_displayed_message();
  }, [rooms_list]);

  React.useEffect(() => {
    if (!("character" in context_data_character)) return;

    update_rooms([...context_data_character.character.friends_list, "local"]);
  }, [context_data_character]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          <div style={{ width: "80px" }} className="label">
            {current_room.name}
          </div>
          <input
            key="chat_input"
            type="text"
            value={state_input_value}
            onChange={e => {
              set_state_input_value(e.currentTarget.value);
            }}
          ></input>
          <button onClick={props.send_message}>send</button>
          <button onClick={props.clear_messages}>clear</button>
        </div>
        <div className="chat">
          <div className="content">
            <div className="column_left">{state_display_rooms}</div>
            <div className="column_right">{state_display_messages}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Chat;
