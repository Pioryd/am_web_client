import React from "react";
import Table from "rc-table";
import { ProtocolContext } from "../../../../context/protocol";
import Util from "../../../../framework/util";

import "./index.css";

const columns = [
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    width: 100
  },
  {
    title: "Area",
    dataIndex: "area",
    key: "area",
    width: 100
  },
  {
    title: "Object_ID",
    dataIndex: "object_id",
    key: "object_id",
    width: 100
  },
  {
    title: "API",
    dataIndex: "api",
    key: "api",
    width: 100
  },
  {
    title: "Data",
    dataIndex: "data",
    key: "data",
    width: 300
  }
];

const PACKET_NAME = "data_mirror";

function Actions(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_data, set_state_data] = React.useState([]);

  const parse_packet = () => {
    const packets = context_packets_fn.peek(PACKET_NAME);
    if (packets.length === 0) return;

    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());

    const data = [];
    let index = 0;
    for (const action of packet.mirror.actions) {
      data.push({
        ...action,
        time: new Date(action.time).toLocaleTimeString(),
        data: JSON.stringify(action.data, null, 2),
        key: index + "_" + action.time
      });
      index++;
    }
    data.reverse();
    set_state_data(data);
  };

  React.useEffect(() => parse_packet(), [context_packets_data]);

  return (
    <React.Fragment>
      <div className="bar">
        <label>{`Last sync: ${state_last_sync}`}</label>
      </div>
      <Table columns={columns} data={state_data} />
    </React.Fragment>
  );
}

export default Actions;
