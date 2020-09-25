import React from "react";
import { ConnectionContext } from "../../../../context/connection";
import Util from "../../../../framework/util";
import { v4 as uuidv4 } from "uuid";
import ModuleWindow from "../../../../components/module_window";

import "./index.css";

const PACKET_NAME = "data_mirror";

function Map(props) {
  const {
    context_connection_packets_data,
    context_connection_fn
  } = React.useContext(ConnectionContext);

  const [state_json_data, set_state_json_data] = React.useState("");
  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [
    state_show_system_objects,
    set_state_show_system_objects
  ] = React.useState(false);

  const parse_packet = () => {
    const packets = context_connection_fn.peek(PACKET_NAME);
    if (packets.length === 0) return;

    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());

    {
      function create_list(objects) {
        const get_objects_by_area = (area) => {
          let rendered = [];
          for (const [name, object] of Object.entries(objects)) {
            if (object.area === area) {
              let object_class = "object";
              if (
                object.properties.includes("system") &&
                state_show_system_objects === false
              )
                continue;

              if (object.properties.includes("area")) {
                object_class = "area";
              } else if (object.properties.includes("am")) {
                object_class = "am";
              } else if (object.properties.includes("user")) {
                object_class = "user";
              }

              rendered.push(
                <li key={uuidv4()} className={object_class}>
                  <span className="system">
                    {state_show_system_objects === true &&
                      object.properties.includes("system") &&
                      "[System]"}
                  </span>
                  {name}
                  <ul className="map-list-element">
                    {get_objects_by_area(name)}
                  </ul>
                </li>
              );
            }
          }
          return rendered;
        };

        const root = (
          <ul className="map-list-element">{get_objects_by_area("")}</ul>
        );

        return root;
      }

      set_state_json_data(
        <ul className="map-list-element">
          {create_list(packet.mirror.objects)}
        </ul>
      );
    }
  };

  React.useEffect(() => parse_packet(), [
    context_connection_packets_data,
    state_show_system_objects
  ]);

  return (
    <ModuleWindow
      bar={<label>{`Last sync: ${state_last_sync}`}</label>}
      content={
        <React.Fragment>
          <span className="object">[Object] </span>
          <span className="area">[Area] </span>
          <span className="am">[AM] </span>
          <span className="user">[User] </span>
          <span className="system">
            <input
              name="show"
              type="checkbox"
              checked={state_show_system_objects}
              onChange={(e) => set_state_show_system_objects(e.target.checked)}
            />
            [System]
          </span>
          {state_json_data}
        </React.Fragment>
      }
    />
  );
}

export default Map;
