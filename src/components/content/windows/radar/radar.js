import React from "react";
import { AppContext } from "../../../context/app";
import { GuiContext } from "../../../gui_context";

function Radar(props) {
  const { context_source } = React.useContext(AppContext);
  const { context_set_clicked_point_name } = React.useContext(GuiContext);

  const [state_source, set_state_source] = React.useState(context_source);
  const [state_options, set_state_options] = React.useState({
    show_position: true,
    show_info: true,
    zoom: 1,
    map_size: { width: 1000, height: 1000 },
    show_map_size: { width: 1000, height: 1000 },
    center_data: { name: undefined, x: 50, y: 50 },
    map_style: { width: `0px`, height: `0px` },
    label_mouse_position_text: "Mouse position: 0:0"
  });
  const [state_points, set_state_points] = React.useState();

  React.useEffect(() => {
    const update = (source, map_size) => {
      const create_point = (options, point) => {
        let style = {
          width: "",
          height: "",
          top: "",
          left: "",
          backgroundColor: ""
        };

        // Const every point size
        const div_size = { width: point.radius * 2, height: point.radius * 2 };

        // Create and setup point div
        style.width = div_size.width + "px";
        style.height = div_size.height + "px";

        let center_top = 0;
        let center_left = 0;

        // Set position of point
        if (point.center !== undefined && point.center === true) {
          // Center point
          style.top = center_top + "px";
          style.left = center_left + "px";
        } else {
          // Any other point
          style.top = `${center_top -
            options.zoom * (options.center_data.x - point.x)}px`;
          style.left = `${center_left -
            options.zoom * (options.center_data.y - point.y)}px`;
        }

        style.backgroundColor =
          point.color !== undefined ? `${point.color}` : "white";

        return (
          <div
            className="point"
            key={point.name}
            onClick={e => {
              e = e || window.event;
              e.preventDefault();

              context_set_clicked_point_name(point.name);
            }}
            style={style}
          >
            <div className="info">
              {options.show_info && <p>{point.name}</p>}
              {options.show_position && <p>{`x[${point.x}] y[${point.y}]`}</p>}
            </div>
          </div>
        );
      };

      if (source !== undefined) set_state_source(source);
      else source = [...state_source];

      let options = { ...state_options };

      if (map_size !== undefined) options.map_size = map_size;

      if (options.center_data.name !== undefined) {
        for (let i = 0; i < source.length; i++) {
          if (options.center_data.name === source[i].name) {
            options.center_data.x = options.source[i].x;
            options.center_data.y = options.source[i].y;
            break;
          }
        }
      }

      let points = [];
      for (let i = 0; i < source.length; i++)
        points.push(create_point(options, source[i]));

      set_state_points(points);
      set_state_options(options);
    };

    if (context_source === undefined) return;
    // if (context_source !== undefined) set_state_source(context_source);
    update(context_source.points);
  }, [
    context_source,
    state_options.show_position,
    state_options.show_info,
    state_source
  ]);

  return (
    <React.Fragment>
      <div className="contentbody">
        <div className="bar">
          <button
            onClick={e => {
              set_state_options({
                ...state_options,
                zoom: state_options.zoom + 1
              });
            }}
          >
            {"zoom-in"}
          </button>
          <button
            onClick={e => {
              set_state_options({
                ...state_options,
                zoom: state_options.zoom - 1
              });
            }}
          >
            {"zoom-out"}
          </button>
          <button
            onClick={e => {
              let width = parseInt(
                state_options.map_style.width.replace("px", "")
              );
              let height = parseInt(
                state_options.map_style.height.replace("px", "")
              );
              width += 100;
              height += 100;

              set_state_options({
                ...state_options,
                map_style: { width: `${width}px`, height: `${height}px` }
              });
            }}
          >
            {"enlarge"}
          </button>
          <button
            onClick={e => {
              let width = parseInt(
                state_options.map_style.width.replace("px", "")
              );
              let height = parseInt(
                state_options.map_style.height.replace("px", "")
              );
              width -= 100;
              height -= 100;
              if (width < 200) width = 200;
              if (height < 200) height = 200;
              set_state_options({
                ...state_options,
                map_style: { width: `${width}px`, height: `${height}px` }
              });
            }}
          >
            {"reduce"}
          </button>
          <button
            onClick={e => {
              set_state_options({
                ...state_options,
                map_style: {
                  width: `${state_options.show_map_size.width}px`,
                  height: `${state_options.show_map_size.height}px`
                },
                zoom: 1
              });
            }}
          >
            {"reset"}
          </button>
          <button
            onClick={e => {
              set_state_options({
                ...state_options,
                show_info: !state_options.show_info
              });
            }}
          >
            {state_options.show_info ? "hide info" : "show info"}
          </button>
          <button
            onClick={e => {
              set_state_options({
                ...state_options,
                show_position: !state_options.show_position
              });
            }}
          >
            {state_options.show_position ? "hide pos" : "show pos"}
          </button>
          <div>{state_options.label_mouse_position_text}</div>
        </div>
        <div
          className="radar-map"
          style={{
            width: `${state_options.show_map_size.width}px`,
            height: `${state_options.show_map_size.height}px`
          }}
          onMouseMove={e => {
            e = e || window.event;
            e.preventDefault();

            const bounds = e.target.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;

            set_state_options({
              ...state_options,
              label_mouse_position_text: `mouse_position[${x}:${y}]`
            });
          }}
        >
          {state_points}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Radar;
