import React from "react";
import ReactJson from "react-json-view";
import { ConnectionContext } from "../../../context/connection";
import Util from "../../../framework/util";
import ModuleWindow from "../../../components/module_window";

const DEFAULT_INTERVAL = 1000;
const MIN_INTERVAL = 10;
const MAX_INTERVAL = 10000;

function JsonData(props) {
  const {
    context_connection_packets_data,
    context_connection_fn
  } = React.useContext(ConnectionContext);

  const ref_auto_sync = React.useRef({});

  const [state_json_data, set_state_json_data] = React.useState({});
  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_auto_sync, set_state_auto_sync] = React.useState(true);
  const [state_sync_interval, set_state_sync_interval] = React.useState(
    DEFAULT_INTERVAL
  );

  // Refresh
  const refresh_json_data = () => {
    context_connection_fn.send(props.packet_name);
  };

  // Clear
  const clear_json_data = () => {
    set_state_json_data({});
    set_state_last_sync("");
  };

  React.useEffect(() => {
    const packets = context_connection_fn.peek(props.packet_name);
    if (packets.length === 0) return;

    const packet = packets.pop();

    set_state_json_data(packet.json);
    set_state_last_sync(Util.get_time_hms());
  }, [context_connection_packets_data]);

  // Auto sync
  React.useEffect(() => {
    if (props.auto_sync === false) return;

    ref_auto_sync.current.state_sync_interval = state_sync_interval;
    ref_auto_sync.current.state_auto_sync = state_auto_sync;

    const async_auto_sync = () => {
      const auto_sync = ref_auto_sync.current.state_auto_sync;
      if (auto_sync === true) refresh_json_data();

      ref_auto_sync.current.timeout = setTimeout(() => {
        async_auto_sync();
      }, ref_auto_sync.current.state_sync_interval);
    };

    async_auto_sync();
    return () => {
      clearTimeout(ref_auto_sync.current.timeout);
    };
  }, []);

  React.useEffect(() => {
    ref_auto_sync.current.state_sync_interval = state_sync_interval;
    ref_auto_sync.current.state_auto_sync = state_auto_sync;
  }, [state_sync_interval, state_auto_sync]);

  return (
    <ModuleWindow
      bar={
        <React.Fragment>
          {props.auto_sync === true && (
            <React.Fragment>
              <input
                name="auto_sync"
                type="checkbox"
                checked={state_auto_sync}
                onChange={(e) => set_state_auto_sync(e.target.checked)}
              />
              <input
                key="interval_value"
                name="interval_value"
                type="number"
                value={state_sync_interval}
                min={MIN_INTERVAL}
                max={MAX_INTERVAL}
                step={100}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= MIN_INTERVAL && value <= MAX_INTERVAL)
                    set_state_sync_interval(value);
                }}
              />
            </React.Fragment>
          )}
          {props.refresh === true && (
            <button onClick={refresh_json_data}>refresh</button>
          )}
          <label>{`Last sync: ${state_last_sync}`}</label>
          {props.clear === true && (
            <button onClick={clear_json_data}>clear</button>
          )}
        </React.Fragment>
      }
      content={
        <React.Fragment>
          <ReactJson
            name="JsonData"
            src={state_json_data}
            theme="bright:inverted"
            indentWidth={2}
            collapsed={true} // Not collapsed big data is lagging
          />
        </React.Fragment>
      }
    />
  );
}

export default JsonData;
