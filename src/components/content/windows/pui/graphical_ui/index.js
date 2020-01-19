import React from "react";
import { AppContext } from "../../../../../context/app";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import "./index.css";

const objects = {
  cactus: { style: {}, src: "/images/game/Items/cactus.png" },
  rock: { style: {}, src: "/images/game/Items/rock.png" },
  mushroom_red: { style: {}, src: "/images/game/Items/mushroomRed.png" },
  spikes: { style: {}, src: "/images/game/Items/spikes.png" },
  bush: { style: {}, src: "/images/game/Items/bush.png" },
  plant: { style: {}, src: "/images/game/Items/plant.png" },
  mushroom_brown: { style: {}, src: "/images/game/Items/mushroomBrown.png" },
  portal: {
    style: { top: "-40px", position: "relative", zIndex: 1 },
    src: "/images/game/Tiles/door_closed_full.png"
  }
};

const CELL_SIZE = 70;
function GraphicalUI() {
  const {
    context_character_data_character,
    context_character_data_land,
    context_character_data_world
  } = React.useContext(AppContext);

  const [state_map_size, set_state_map_size] = React.useState(12);
  const [
    state_character_div_style,
    set_state_character_div_style
  ] = React.useState({
    top: "-230px",
    left: 70 * 1 + "px",
    width: "66px",
    height: "92px",
    backgroundImage: "url(/images/game/Player/p3_front.png)"
  });
  const [state_cells, set_state_cells] = React.useState([]);

  const render_map = (map, environment_objects) => {
    let cells = [];
    for (let i = 0; i < (state_map_size + 2) * 4; i++) {
      let style = {};
      const obj_data = { field_type: "", name: "", obj: {} };
      if (i < state_map_size + 2 || i >= (state_map_size + 2) * 3) {
        obj_data.field_type = "Sky";
      }
      if (i >= state_map_size + 2 && i < (state_map_size + 2) * 2) {
        obj_data.field_type = "Obj";

        let position = i - (state_map_size + 2) - 1;
        if (position >= 0 && position < map.length) {
          if (map[position].objects_list.length > 0) {
            const object_id = map[position].objects_list[0];
            for (const [id, data] of Object.entries(environment_objects)) {
              if (id === object_id) {
                obj_data.obj = objects[data.type];
                obj_data.name = data.name;
                break;
              }
            }
          }
        }
      }
      if (i >= (state_map_size + 2) * 2 && i < (state_map_size + 2) * 3) {
        obj_data.field_type = "Ground";

        if (i === (state_map_size + 2) * 2) {
        } else if (i === (state_map_size + 2) * 2 + 1) {
          style.backgroundImage = "url(/images/game/Tiles/grassLeft.png)";
        } else if (
          i > (state_map_size + 2) * 2 + 1 &&
          i < (state_map_size + 2) * 3 - 2
        ) {
          style.backgroundImage = "url(/images/game/Tiles/grassMid.png)";
        } else if (i === (state_map_size + 2) * 3 - 2) {
          style.backgroundImage = "url(/images/game/Tiles/grassRight.png)";
        }
      }
      cells.push(
        <div
          key={i}
          className="cell"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            ...style
          }}
        >
          <Tooltip
            placement="top"
            trigger={["hover"]}
            overlay={<span>{obj_data.name}</span>}
            arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
          >
            <img
              className="sprite"
              style={obj_data.obj.style}
              src={obj_data.obj.src}
              onClick={() => {
                console.log("hello");
              }}
            />
          </Tooltip>
        </div>
      );
    }
    set_state_cells(cells);
  };

  React.useEffect(() => {
    const land_data = context_character_data_land;
    if (
      "map" in land_data &&
      "environment_objects_map" in context_character_data_world
    ) {
      const map_size = land_data.map.length;

      set_state_map_size(map_size);
      render_map(
        land_data.map,
        context_character_data_world.environment_objects_map
      );
    }
  }, [
    context_character_data_character,
    context_character_data_land,
    context_character_data_world
  ]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        <div className="graphical_ui">
          <div className="content">
            <div
              style={{
                width: (state_map_size + 2) * CELL_SIZE,
                height: 4 * CELL_SIZE
              }}
              className="map"
            >
              {state_cells}
            </div>
            <div style={state_character_div_style} className="character" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GraphicalUI;
