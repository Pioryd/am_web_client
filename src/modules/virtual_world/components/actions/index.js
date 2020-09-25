import React from "react";
import Table from "./table";
import { ConnectionContext } from "../../../../context/connection";
import Util from "../../../../framework/util";
import ModuleWindow from "../../../../components/module_window";

import "./index.css";

const PACKET_NAME = "data_mirror";

function Actions(props) {
  const {
    context_connection_packets_data,
    context_connection_fn
  } = React.useContext(ConnectionContext);

  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_data, set_state_data] = React.useState([]);

  const parse_packet = () => {
    const packets = context_connection_fn.peek(PACKET_NAME);
    if (packets.length === 0) return;

    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());

    const data = [];
    let index = 0;
    for (const action of packet.mirror.actions) {
      data.push({
        info: { ...action, time: new Date(action.time).toLocaleTimeString() },
        data: action.data,
        key: index + "_" + action.time
      });
      index++;
    }
    data.reverse();

    set_state_data(data);
  };

  React.useEffect(() => parse_packet(), [context_connection_packets_data]);

  return (
    <ModuleWindow
      bar={
        <React.Fragment>
          <label>{`Last sync: ${state_last_sync}`}</label>
          <label>
            Legend:[<span className="time">Time </span>
            <span className="area">Area </span>
            <span className="object">ObjectID </span>
            <span className="api">API</span>]
          </label>
        </React.Fragment>
      }
      content={
        <React.Fragment>
          {state_data.length > 0 ? (
            <Table data={state_data} />
          ) : (
            <div className="no-data">No data</div>
          )}
        </React.Fragment>
      }
    />
  );
}

export default Actions;
