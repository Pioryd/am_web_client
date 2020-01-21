import React from "react";
import { ProtocolContext } from "../../context/protocol";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import "./index.css";

const CELL_SIZE = 70;

const ENVIRONMENT_OBJECTS = {
  cactus: {
    style: { top: CELL_SIZE + "px" },
    src: "/images/game/Items/cactus.png"
  },
  rock: {
    style: { top: CELL_SIZE + "px" },
    src: "/images/game/Items/rock.png"
  },
  mushroom_red: {
    style: { top: CELL_SIZE + "px" },
    src: "/images/game/Items/mushroomRed.png"
  },
  spikes: {
    style: { top: CELL_SIZE + "px" },
    src: "/images/game/Items/spikes.png"
  },
  bush: {
    style: { top: CELL_SIZE + "px" },
    src: "/images/game/Items/bush.png"
  },
  plant: {
    style: { top: CELL_SIZE + "px" },
    src: "/images/game/Items/plant.png"
  },
  mushroom_brown: {
    style: { top: CELL_SIZE + "px" },
    src: "/images/game/Items/mushroomBrown.png"
  },
  portal: {
    style: { top: "30px", position: "relative", zIndex: 1 },
    src: "/images/game/Tiles/door_closed_full.png"
  }
};

const CHARACTERS = {
  1: {
    style: {},
    src: "/images/game/Player/p1_front.png"
  },
  2: {
    style: {},
    src: "/images/game/Player/p2_front.png"
  },
  3: {
    style: {},
    src: "/images/game/Player/p3_front.png"
  }
};
function GraphicalUI() {
  const {
    context_character_data_character,
    context_character_data_land,
    context_character_data_world,
    context_character_send_change_position,
    context_character_send_process_script_action
  } = React.useContext(ProtocolContext);

  const [state_map_size, set_state_map_size] = React.useState(12);

  const [
    state_current_index_position,
    set_state_current_index_position
  ] = React.useState(-1);

  const [state_ground_elements, set_state_ground_elements] = React.useState([]);
  const [
    state_environment_objects_elements,
    set_state_environment_objects_elements
  ] = React.useState([]);
  const [
    state_characters_elements,
    set_state_characters_elements
  ] = React.useState([]);
  const [
    state_virtual_world_elements,
    set_state_virtual_world_elements
  ] = React.useState([]);

  const [state_debug_info, set_state_debug_info] = React.useState(false);

  const render_ground = map => {
    const ground_elements = [];

    for (let i = 0; i < map.length; i++) {
      const style = { top: 140, zIndex: 0 };
      let src = "";

      if (i === 0) src = "/images/game/Tiles/grassLeft.png";
      else if (i === map.length - 1) src = "/images/game/Tiles/grassRight.png";
      else src = "/images/game/Tiles/grassMid.png";

      const left = CELL_SIZE * (i + 1);
      style.left = left + "px";

      let info = { name: "Ground" };
      if (state_debug_info) {
        info = { position_index: i, ...info };
      }

      const text_info = JSON.stringify(info);
      ground_elements.push(
        <Tooltip
          key={"ground_" + i}
          placement="top"
          trigger={["hover"]}
          overlay={<span>{text_info}</span>}
          arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
        >
          <img
            className="sprite"
            style={style}
            src={src}
            alt={text_info}
            onClick={() => {
              context_character_send_change_position({ position_x: i });
            }}
          />
        </Tooltip>
      );
    }

    set_state_ground_elements(ground_elements);
  };

  const render_objects = (map, environment_objects) => {
    const environment_objects_elements = [];

    for (let i = 0; i < map.length; i++) {
      const point = map[i];
      if (point.objects_list.length > 0) {
        const object_id = point.objects_list[0];

        for (const [id, data] of Object.entries(environment_objects)) {
          if (id !== object_id) continue;

          let on_click = () => {};
          if (data.actions_list.length > 0) {
            on_click = () => {
              context_character_send_process_script_action({
                object_id: id,
                action_id: 0,
                dynamic_args: {}
              });
            };
          }

          const src = ENVIRONMENT_OBJECTS[data.type].src;
          const style = { zIndex: 1, ...ENVIRONMENT_OBJECTS[data.type].style };
          const left = CELL_SIZE * (i + 1);
          style.left = left + "px";

          let info = { name: data.name };
          if (state_debug_info) {
            info = {
              id: object_id,
              type: data.type,
              action: data.actions_list.length > 0,
              ...info
            };
          }

          const text_info = JSON.stringify(info);
          environment_objects_elements.push(
            <Tooltip
              key={"environment_object_" + i}
              placement="top"
              trigger={["hover"]}
              overlay={<span>{text_info}</span>}
              arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
            >
              <img
                className="sprite"
                style={style}
                src={src}
                alt={text_info}
                onClick={on_click}
              />
            </Tooltip>
          );
        }
      }
    }
    set_state_environment_objects_elements(environment_objects_elements);
  };

  const render_characters = (map, characters) => {
    const characters_elements = [];

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].characters_list.length; j++) {
        let character = { id: map[i].characters_list[j] };
        const style = {
          top: "50px",
          left: CELL_SIZE * (i + 1) + "px",
          zIndex: j + 2
        };

        for (const [id, data] of Object.entries(characters)) {
          if (id === character.id) {
            character = { ...data, ...character };
            break;
          }
        }

        const src = CHARACTERS[character.outfit].src;

        if (!state_debug_info) {
          delete character.id;
          delete character.outfit;
        }
        const string_info = JSON.stringify(character);

        characters_elements.push(
          <Tooltip
            key={"characters_" + i + "_" + j}
            placement="top"
            trigger={["hover"]}
            overlay={<span>{string_info}</span>}
            arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
          >
            <img className="sprite" style={style} src={src} alt={string_info} />
          </Tooltip>
        );
      }
    }

    set_state_characters_elements(characters_elements);
  };

  const render_virtual_world = () => {
    set_state_virtual_world_elements(
      <div
        style={{
          height: "10em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <label
          style={{
            fontSize: "70px",
            backgroundColor: "transparent"
          }}
        >
          {"VIRTUAL WORLD"}
        </label>
      </div>
    );
  };

  const on_key_press = e => {
    if (!("map" in context_character_data_land)) return;

    let index_position = state_current_index_position;
    const max_index_position = context_character_data_land.map.length - 1;
    if (e.key === "a") index_position = Math.max(0, index_position - 1);
    else if (e.key === "d")
      index_position = Math.min(max_index_position, index_position + 1);
    else return;

    context_character_send_change_position({ position_x: index_position });
  };

  React.useEffect(() => {
    const land_data = context_character_data_land;
    const world_data = context_character_data_world;
    const character_data = context_character_data_character;

    if (
      !(
        "map" in land_data &&
        "environment_objects_map" in world_data &&
        "id" in character_data
      )
    ) {
      set_state_ground_elements([]);
      set_state_environment_objects_elements([]);
      set_state_characters_elements([]);

      render_virtual_world();
      return;
    }

    set_state_virtual_world_elements([]);

    const character_id = character_data.id;
    const map_size = land_data.map.length;
    let current_index_position = -1;
    for (let i = 0; i < land_data.map.length; i++) {
      if (land_data.map[i].characters_list.includes(character_id)) {
        current_index_position = i;
        break;
      }
    }

    set_state_current_index_position(current_index_position);
    set_state_map_size(map_size);

    render_characters(land_data.map, world_data.characters_map);
    render_objects(land_data.map, world_data.environment_objects_map);
    render_ground(land_data.map);
  }, [
    context_character_data_character,
    context_character_data_land,
    context_character_data_world
  ]);

  return (
    <React.Fragment>
      <div className="content_body" onKeyPress={on_key_press} tabIndex="0">
        <div className="bar">
          <label>
            <input
              name="hello"
              type="checkbox"
              checked={state_debug_info}
              onChange={e => {
                set_state_debug_info(e.target.checked);
              }}
            />
            Debug info
          </label>
        </div>
        <div className="graphical_ui">
          <div className="content">
            <div
              style={{
                width: (state_map_size + 2) * CELL_SIZE,
                height: 4 * CELL_SIZE
              }}
              className="map"
            >
              {state_ground_elements}
              {state_environment_objects_elements}
              {state_characters_elements}
              {state_virtual_world_elements}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GraphicalUI;
