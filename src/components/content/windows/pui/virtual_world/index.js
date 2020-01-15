import React from "react";
import ReactJson from "react-json-view";
import Util from "../../../../../framework/util";
import { AppContext } from "../../../../../context/app";
import "./index.css";

function Chat(props) {
  const {
    context_data_character,
    context_packets_virtual_world,
    context_pop_packets_virtual_world,
    context_send_virtual_world,
    context_send_leave_virtual_world
  } = React.useContext(AppContext);

  const [
    state_virtual_world_enabled,
    set_state_virtual_world_enabled
  ] = React.useState(false);
  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_messages, set_state_messages] = React.useState([]);
  const [state_display_messages, set_state_display_messages] = React.useState(
    []
  );

  const [
    state_virtual_world_data,
    set_state_virtual_world_data
  ] = React.useState({});

  const ref_text_input = React.useRef();

  const update_displayed_message = () => {
    const messages = state_messages;

    const display_messages = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      if (message.received === true)
        display_messages.push(
          <div key={`received_${i}`} className="received">
            <div className="info">{`[${Util.get_time_hms(
              message.date
            )}] VirtualWorld:`}</div>
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
      packet_data: { text }
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

  const refresh = () => {
    context_send_virtual_world({
      packet_id: "data",
      packet_data: {}
    });
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
    const character_data = context_data_character;
    let virtual_world_enabled =
      "virtual_world_id" in character_data &&
      character_data.virtual_world_id !== "";

    if (
      virtual_world_enabled === true &&
      state_virtual_world_enabled !== true
    ) {
      refresh();
    }
    set_state_virtual_world_enabled(virtual_world_enabled);
  }, [context_data_character]);

  React.useEffect(() => {
    const received_messages = context_pop_packets_virtual_world();
    if (received_messages == null) return;

    for (const message of received_messages) {
      console.log("message", message);
      const { packet_id, data } = message;
      if (packet_id === "data") {
        set_state_virtual_world_data(data);
        set_state_last_sync(Util.get_time_hms());
      } else if (packet_id === "message") {
        add_message({ ...data, date: new Date(), received: true });
      }
    }

    update_displayed_message();
  }, [context_packets_virtual_world]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          {state_virtual_world_enabled ? (
            <React.Fragment>
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
              <label>{`Last data: ${state_last_sync}`}</label>
              <button onClick={refresh}>refresh</button>{" "}
              <button onClick={leave_virtual_world}>leave</button>{" "}
            </React.Fragment>
          ) : (
            <div>{"You are NOT inside virtual world"}</div>
          )}
        </div>
        <div className="virtual_world">
          <div className="content">
            <div className="column_left">
              {state_virtual_world_enabled ? state_display_messages : ""}
            </div>
            <div className="column_right">
              {state_virtual_world_enabled ? (
                <ReactJson
                  name="context_data_full"
                  src={state_virtual_world_data}
                  theme="monokai"
                  indentWidth={2}
                  collapsed={true}
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Chat;
