import React from "react";
import ReactJson from "react-json-view";
import { ProtocolContext } from "../../../context/protocol";
import Util from "../../../framework/util";

const PACKET_NAME = "data_mirror";

function Statistic(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_json_data, set_state_json_data] = React.useState({});
  const [state_last_sync, set_state_last_sync] = React.useState("");

  const parse_packet = () => {
    const packets = context_packets_fn.peek(PACKET_NAME);
    if (packets.length === 0) return;

    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());

    const json_data = {};
    for (const [name, object] of Object.entries(packet.mirror.objects)) {
      const object_data = {};
      for (const [key, value] of Object.entries(object.data))
        if (key !== "queue") object_data[key] = value;
      if (Object.keys(object_data).length > 0) json_data[name] = object_data;
    }

    set_state_json_data(json_data);
  };

  React.useEffect(() => parse_packet(), [context_packets_data]);

  return (
    <div className="content_body">
      <div className="bar">
        <label>{`Last sync: ${state_last_sync}`}</label>
      </div>
      <ReactJson
        name="Statistics"
        src={state_json_data}
        theme="isotope"
        indentWidth={2}
        collapsed={false} // Not collapsed big data is lagging
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    </div>
  );
}

export default Statistic;
