import React from "react";
import InputRow from "./input_row";
import SelectRow from "./select_row";
import { ProtocolContext } from "../../../../context/protocol";
import "./index.css";

function EditData(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_data_character, set_state_data_character] = React.useState({});
  const [state_data_land, set_state_data_land] = React.useState({});
  const [state_data_world, set_state_data_world] = React.useState({});

  const [
    state_select_row_actions,
    set_state_select_row_actions
  ] = React.useState({});
  const [
    state_select_row_position,
    set_state_select_row_position
  ] = React.useState({});
  const [state_select_row_land, set_state_select_row_land] = React.useState({});
  const [
    state_select_row_friends_list,
    set_state_select_row_friends_list
  ] = React.useState({});
  const [
    state_select_row_characters,
    set_state_select_row_characters
  ] = React.useState({});

  const [
    state_actions_dynamic_args,
    set_state_actions_dynamic_args
  ] = React.useState({});

  const set_row_actions = world_data => {
    // set_state_select_row_actions
    let select_row_actions = { row_value: "", row_options: [] };
    if ("environment_objects_map" in world_data) {
      for (const [object_id, object_data] of Object.entries(
        world_data.environment_objects_map
      )) {
        const land = state_data_land;
        if ("map" in land) {
          for (const point of land.map) {
            if (
              "objects_list" in point &&
              point.objects_list.includes(object_id)
            )
              for (const action_id of object_data.actions_list) {
                select_row_actions.row_options.push({
                  label: `${object_data.name}\n${action_id}`,
                  value: { object_id, action_id }
                });
              }
          }
        }
      }

      if (select_row_actions.row_options.length > 0)
        select_row_actions.row_value = select_row_actions.row_options[0];

      set_state_select_row_actions(select_row_actions);
    }
  };

  const set_row_position = (character_data, land_data) => {
    let input_row_position = { row_value: 0, row_options: [] };
    if ("id" in character_data && "id" in land_data) {
      for (let i = 0; i < land_data.map.length; i++) {
        if (land_data.map[i].characters_list.includes(character_data.id))
          input_row_position.row_value = i;

        input_row_position.row_options.push({ label: i, value: i });
      }
    }
    set_state_select_row_position(input_row_position);
  };

  const set_row_land = world_data => {
    let select_row_land = { row_value: "", row_options: [] };
    if ("lands_map" in world_data) {
      for (const [land_id, land_data] of Object.entries(world_data.lands_map)) {
        select_row_land.row_options.push({
          label: land_data.name,
          value: land_id
        });
      }

      if (select_row_land.row_options.length > 0)
        select_row_land.row_value = select_row_land.row_options[0];

      set_state_select_row_land(select_row_land);
    }
  };

  const set_row_characters = (character_data, world_data) => {
    let select_row_characters = { row_value: "", row_options: [] };
    if ("id" in character_data && "lands_map" in world_data) {
      for (const [id, data] of Object.entries(world_data.characters_map)) {
        if (!character_data.friends_list.includes(data.name))
          select_row_characters.row_options.push({
            label: data.name,
            value: data.name
          });
      }

      if (select_row_characters.row_options.length > 0)
        select_row_characters.row_value = select_row_characters.row_options[0];

      set_state_select_row_characters(select_row_characters);
    }
  };

  const set_row_friends_list = character_data => {
    let select_row_friends_list = { row_value: "", row_options: [] };
    if ("id" in character_data) {
      for (const friend_name of character_data.friends_list)
        select_row_friends_list.row_options.push({
          label: friend_name,
          value: friend_name
        });

      if (select_row_friends_list.row_options.length > 0)
        select_row_friends_list.row_value =
          select_row_friends_list.row_options[0];

      set_state_select_row_friends_list(select_row_friends_list);
    }
  };

  React.useEffect(() => {
    const character_data = state_data_character;
    const land_data = state_data_land;
    const world_data = state_data_world;

    set_row_actions(world_data);
    set_row_position(character_data, land_data);
    set_row_land(world_data);
    set_row_characters(character_data, world_data);
    set_row_friends_list(character_data);
  }, [state_data_character, state_data_land, state_data_world]);

  React.useEffect(() => {
    {
      const packets = context_packets_fn.peek("data_character");
      if (packets.length > 0) set_state_data_character(packets.pop());
    }
    {
      const packets = context_packets_fn.peek("data_land");
      if (packets.length > 0) set_state_data_land(packets.pop());
    }
    {
      const packets = context_packets_fn.peek("data_world");
      if (packets.length > 0) set_state_data_world(packets.pop());
    }
  }, [context_packets_data]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        <div className="edit-form">
          <SelectRow
            key="change_script_action"
            row_key="actions"
            row_value={state_select_row_actions.row_value}
            row_options={state_select_row_actions.row_options}
            on_process={value => {
              context_packets_fn.send("script_action", {
                object_id: value.object_id,
                action_id: value.action_id,
                dynamic_args:
                  Object.keys(state_actions_dynamic_args).length === 0
                    ? {}
                    : JSON.parse(state_actions_dynamic_args)
              });
            }}
          >
            <div style={{ height: "20px" }}>Additional args (JSON)</div>
            <div style={{ height: "20px" }}>
              <input
                className="input_value"
                key={"actions_additional_args"}
                type="text"
                onChange={e => {
                  set_state_actions_dynamic_args(e.target.value);
                }}
              ></input>
            </div>
          </SelectRow>
          <SelectRow
            key="change_position"
            row_key="position"
            row_value={state_select_row_position.row_value}
            row_options={state_select_row_position.row_options}
            on_process={value => {
              context_packets_fn.send("character_change_position", {
                position_x: value
              });
            }}
          />
          <SelectRow
            key="change_land"
            row_key="land"
            row_value={state_select_row_land.row_value}
            row_options={state_select_row_land.row_options}
            on_process={value => {
              context_packets_fn.send("character_change_land", {
                land_id: value
              });
            }}
          />
          <SelectRow
            key="context_send_add_friend"
            row_key="add friend"
            row_value={state_select_row_characters.row_value}
            row_options={state_select_row_characters.row_options}
            on_process={value => {
              context_packets_fn.send("character_add_friend", { name: value });
            }}
          />
          <SelectRow
            key="context_send_remove_friend"
            row_key="remove friend"
            row_value={state_select_row_friends_list.row_value}
            row_options={state_select_row_friends_list.row_options}
            on_process={value => {
              context_packets_fn.send("character_remove_friend", {
                name: value
              });
            }}
          />
          <InputRow
            key="change_state"
            row_key="change state"
            on_process={value => {
              context_packets_fn.send("character_change_state", {
                name: value
              });
            }}
          />
          <InputRow
            key="change_action"
            row_key="change action"
            on_process={value => {
              context_packets_fn.send("character_change_action", {
                name: value
              });
            }}
          />
          <InputRow
            key="change_activity"
            row_key="change activity"
            on_process={value => {
              context_packets_fn.send("character_change_activity", {
                name: value
              });
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default EditData;
