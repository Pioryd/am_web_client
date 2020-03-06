import React from "react";
import ReactJson from "react-json-view";
import { ProtocolContext } from "../context/protocol";

function ViewData() {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_data_world, set_state_data_world] = React.useState({});
  const [state_data_land, set_state_data_land] = React.useState({});
  const [state_data_character, set_state_data_character] = React.useState({});

  const [
    state_formatted_data_world,
    set_state_formatted_data_world
  ] = React.useState({});
  const [
    state_formatted_data_land,
    set_state_formatted_data_land
  ] = React.useState({});
  const [
    state_formatted_data_character,
    set_state_formatted_data_character
  ] = React.useState({});

  const format_character_data = () => {
    set_state_formatted_data_character(state_data_character);
  };

  const format_land_data = () => {
    let data = {};
    if ("id" in state_data_land) {
      const land = state_data_land;
      const map = [];
      for (const point of land.map) {
        let str_point = "";
        for (const object_id of point.objects_list)
          if (
            "environment_objects_map" in state_data_world &&
            Object.values(state_data_world.environment_objects_map).length > 0
          ) {
            const data = state_data_world.environment_objects_map[object_id];
            str_point += `<O: ${data.name}(${data.type})>`;
          } else {
            str_point += `<O: ${object_id}(${object_id})>`;
          }
        for (const character_id of point.characters_list)
          if (
            "characters_map" in state_data_world &&
            Object.values(state_data_world.characters_map).length > 0 &&
            character_id in state_data_world.characters_map
          ) {
            const data = state_data_world.characters_map[character_id];
            str_point += `<C: ${data.name}(${data.state})(${data.action})(${data.activity})>`;
          } else {
            str_point += `<C: ${character_id}>`;
          }

        map.push(str_point);
      }

      let land_name = "";
      if (
        "lands_map" in state_data_world &&
        Object.values(state_data_world.lands_map).length > 0
      ) {
        const data = state_data_world.lands_map[land.id];
        land_name = data.name;
      }
      data = { id: land.id, name: land_name, map: map };
    }

    set_state_formatted_data_land(data);
  };

  const format_land_world = () => {
    set_state_formatted_data_world(state_data_world);
  };

  React.useEffect(() => {
    format_character_data();
  }, [state_data_character]);

  React.useEffect(() => {
    format_land_data();
  }, [state_data_land]);

  React.useEffect(() => {
    format_land_world();
  }, [state_data_world]);

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
        <ReactJson
          name="CharacterData"
          src={state_formatted_data_character}
          theme="monokai"
          indentWidth={2}
          collapsed={false}
        />
        <ReactJson
          name="WorldLand"
          src={state_formatted_data_land}
          theme="monokai"
          indentWidth={2}
          collapsed={false}
        />
        <ReactJson
          name="WorldData"
          src={state_formatted_data_world}
          theme="monokai"
          indentWidth={2}
          collapsed={true}
        />
      </div>
    </React.Fragment>
  );
}

export default ViewData;
