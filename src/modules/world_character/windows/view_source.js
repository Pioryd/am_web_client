import React from "react";
import ReactJson from "react-json-view";
import { ProtocolContext } from "../../../context/protocol";

function ViewSource() {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_data_world, set_state_data_world] = React.useState({});
  const [state_data_land, set_state_data_land] = React.useState({});
  const [state_data_character, set_state_data_character] = React.useState({});

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
        <React.Fragment>
          <ReactJson
            name="CharacterData"
            src={state_data_character}
            theme="bright:inverted"
            indentWidth={2}
            collapsed={true}
          />
          <ReactJson
            name="LandData"
            src={state_data_land}
            theme="bright:inverted"
            indentWidth={2}
            collapsed={true}
          />
          <ReactJson
            name="WorldData"
            src={state_data_world}
            theme="bright:inverted"
            indentWidth={2}
            collapsed={true}
          />
        </React.Fragment>
      </div>
    </React.Fragment>
  );
}

export default ViewSource;
