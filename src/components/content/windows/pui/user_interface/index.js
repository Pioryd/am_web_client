import React from "react";
import ReactJson from "react-json-view";
import InputRow from "./input_row";
import SelectRow from "./select_row";
import { AppContext } from "../../../../../context/app";
import "./index.css";

function UserInterface(props) {
  const {
    context_admin,
    context_data_full,
    context_data_character,
    context_data_land,
    context_data_world,
    context_process_script_action,
    context_change_position,
    context_change_land,
    context_add_friend,
    context_remove_friend,
    context_change_state,
    context_change_action,
    context_change_activity
  } = React.useContext(AppContext);

  const [
    state_formated_data_world,
    set_state_formated_data_world
  ] = React.useState({});
  const [
    state_formated_data_land,
    set_state_formated_data_land
  ] = React.useState({});
  const [
    state_formated_data_character,
    set_state_formated_data_character
  ] = React.useState({});

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
  React.useEffect(() => {
    set_state_formated_data_character(context_data_character);
  }, [context_data_character]);

  const [
    state_actions_dynamic_args,
    set_state_actions_dynamic_args
  ] = React.useState({});

  React.useEffect(() => {
    // Format land data
    let formated_data = {};
    if ("id" in context_data_land) {
      const land = context_data_land;
      const map = [];
      for (const point of land.map) {
        let str_point = "";
        for (const object_id of point.objects_list)
          if (
            "environment_objects_map" in state_formated_data_world &&
            Object.values(state_formated_data_world.environment_objects_map)
              .length > 0
          ) {
            const data =
              state_formated_data_world.environment_objects_map[object_id];
            str_point += `<O: ${data.name}(${data.type})>`;
          } else {
            str_point += `<O: ${object_id}(${object_id})>`;
          }
        for (const character_id of point.characters_list)
          if (
            "characters_map" in state_formated_data_world &&
            Object.values(state_formated_data_world.characters_map).length > 0
          ) {
            const data = state_formated_data_world.characters_map[character_id];
            str_point += `<C: ${data.name}(${data.state})(${data.action})(${data.activity})>`;
          } else {
            str_point += `<C: ${character_id}>`;
          }

        map.push(str_point);
      }

      let land_name = "";
      if (
        "lands_map" in state_formated_data_world &&
        Object.values(state_formated_data_world.lands_map).length > 0
      ) {
        const data = state_formated_data_world.lands_map[land.id];
        land_name = data.name;
      }
      formated_data = { id: land.id, name: land_name, map: map };
    }

    set_state_formated_data_land(formated_data);
  }, [context_data_land, state_formated_data_world]);

  React.useEffect(() => {
    set_state_formated_data_world(context_data_world);
  }, [context_data_world]);

  React.useEffect(() => {
    // set_state_select_row_actions
    let world = state_formated_data_world;
    let select_row_actions = { row_value: "", row_options: [] };
    if ("environment_objects_map" in world) {
      for (const [object_id, object_data] of Object.entries(
        world.environment_objects_map
      )) {
        const object_name = object_data.name;
        for (const action_id of object_data.actions_list) {
          select_row_actions.row_options.push({
            label: `${object_name}\n${action_id}`,
            value: { object_id, action_id }
          });
        }
      }

      if (select_row_actions.row_options.length > 0)
        select_row_actions.row_value = select_row_actions.row_options[0];

      set_state_select_row_actions(select_row_actions);
    }

    // set_state_select_row_position
    const character = state_formated_data_character;
    let input_row_position = { row_value: 0, row_options: [] };
    if ("id" in character && "id" in context_data_land) {
      const land = context_data_land;
      for (let i = 0; i < land.map.length; i++) {
        if (land.map[i].characters_list.includes(character.id))
          input_row_position.row_value = i;

        input_row_position.row_options.push({ label: i, value: i });
      }
    }
    set_state_select_row_position(input_row_position);

    // set_state_select_row_land
    world = state_formated_data_world;
    let select_row_land = { row_value: "", row_options: [] };
    if ("lands_map" in world) {
      for (const [land_id, land_data] of Object.entries(world.lands_map)) {
        select_row_land.row_options.push({
          label: land_data.name,
          value: land_id
        });
      }

      if (select_row_land.row_options.length > 0)
        select_row_land.row_value = select_row_land.row_options[0];

      set_state_select_row_land(select_row_land);
    }

    // set_state_select_row_friends_list
    let select_row_friends_list = { row_value: "", row_options: [] };
    if ("id" in character) {
      for (const friend_name of character.friends_list)
        select_row_friends_list.row_options.push({
          label: friend_name,
          value: friend_name
        });

      if (select_row_friends_list.row_options.length > 0)
        select_row_friends_list.row_value =
          select_row_friends_list.row_options[0];

      set_state_select_row_friends_list(select_row_friends_list);
    }

    // set_state_input_row_characters
    let select_row_characters = { row_value: "", row_options: [] };
    if ("id" in character && "lands_map" in world) {
      for (const [character_id, character_data] of Object.entries(
        world.characters_map
      )) {
        if (!character.friends_list.includes(character_data.name))
          select_row_characters.row_options.push({
            label: character_data.name,
            value: character_data.name
          });
      }

      if (select_row_characters.row_options.length > 0)
        select_row_characters.row_value =
          select_row_friends_list.row_options[0];

      set_state_select_row_characters(select_row_characters);
    }
  }, [
    state_formated_data_character,
    state_formated_data_world,
    context_data_land
  ]);

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
              context_process_script_action({
                object_id: value.object_id,
                action_id: value.action_id,
                dynamic_args: JSON.parse(state_actions_dynamic_args)
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
              context_change_position({ position_x: value });
            }}
          />
          <SelectRow
            key="change_land"
            row_key="land"
            row_value={state_select_row_land.row_value}
            row_options={state_select_row_land.row_options}
            on_process={value => {
              console.log("land", value);
              context_change_land({ land_id: value });
            }}
          />
          <SelectRow
            key="context_add_friend"
            row_key="add friend"
            row_value={state_select_row_characters.row_value}
            row_options={state_select_row_characters.row_options}
            on_process={value => {
              context_add_friend({ name: value });
            }}
          />
          <SelectRow
            key="context_remove_friend"
            row_key="remove friend"
            row_value={state_select_row_friends_list.row_value}
            row_options={state_select_row_friends_list.row_options}
            on_process={value => {
              context_remove_friend({ name: value });
            }}
          />
          <InputRow
            key="change_state"
            row_key="change state"
            on_process={value => {
              context_change_state({ name: value });
            }}
          />
          <InputRow
            key="change_action"
            row_key="change action"
            on_process={value => {
              context_change_action({ name: value });
            }}
          />
          <InputRow
            key="change_activity"
            row_key="change activity"
            on_process={value => {
              context_change_activity({ name: value });
            }}
          />
        </div>
        <ReactJson
          name="CharacterData"
          src={state_formated_data_character}
          theme="monokai"
          indentWidth={2}
          collapsed={true}
        />
        <ReactJson
          name="WorldLand"
          src={state_formated_data_land}
          theme="monokai"
          indentWidth={2}
          collapsed={true}
        />
        <ReactJson
          name="WorldData"
          src={state_formated_data_world}
          theme="monokai"
          indentWidth={2}
          collapsed={true}
        />
      </div>
    </React.Fragment>
  );
}

export default UserInterface;
