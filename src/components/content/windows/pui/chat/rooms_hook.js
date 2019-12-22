import React from "react";

function useRooms(props) {
  const [state_current_room, set_state_current_room] = React.useState({
    name: "",
    messages: []
  });
  const [state_rooms_list, set_state_rooms_list] = React.useState({});

  const update_rooms = names_list => {
    const rooms_list = { ...state_rooms_list };

    for (const name of names_list) {
      if (name in rooms_list) continue;
      rooms_list[name] = { name: name, messages: [] };
    }

    for (const [name] of Object.entries(rooms_list))
      if (!names_list.includes(name)) delete rooms_list[name];

    let current_room = state_current_room;

    if (current_room.name === "" || !(current_room.name in rooms_list)) {
      if (Object.keys(rooms_list).length > 0) {
        for (const [key] of Object.entries(rooms_list)) {
          current_room = rooms_list[key];
          break;
        }
      } else {
        current_room = {
          name: "",
          messages: []
        };
      }
    }

    set_state_current_room(current_room);
    set_state_rooms_list(rooms_list);
  };

  const set_current_room = name => {
    if (!(name in state_rooms_list)) return;

    set_state_current_room(state_rooms_list[name]);
  };

  const add_message = ({ name, text, date, received }) => {
    const rooms_list = { ...state_rooms_list };

    if (!(name in rooms_list)) return;

    const room = rooms_list[name];
    room.messages.push({ name, text, date, received });
    room.messages.sort(function(a, b) {
      return b.date - a.date;
    });

    set_state_rooms_list(rooms_list);
  };

  const clear_room_messages = name => {
    const rooms_list = { ...state_rooms_list };
    const current_room = state_current_room;

    if (!(current_room.name in rooms_list)) return;

    const room = rooms_list[current_room.name];
    room.messages = [];

    set_state_rooms_list(rooms_list);
  };

  return {
    current_room: state_current_room,
    rooms_list: state_rooms_list,
    update_rooms: update_rooms,
    set_current_room: set_current_room,
    add_message: add_message,
    clear_room_messages: clear_room_messages
  };
}

export default useRooms;
