import React from "react";
import ReactJson from "react-json-view";
import { ProtocolContext } from "../context/protocol";
import Util from "../../../framework/util";

const DEFAULT_INTERVAL = 1000;
const MIN_INTERVAL = 10;
const MAX_INTERVAL = 10000;

function ModuleData() {
  const { context_send_module_data, context_module_data } = React.useContext(
    ProtocolContext
  );

  const ref_auto_sync = React.useRef({});

  const [state_module_data, set_state_module_data] = React.useState({});
  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_auto_sync, set_state_auto_sync] = React.useState(true);
  const [state_sync_interval, set_state_sync_interval] = React.useState(
    DEFAULT_INTERVAL
  );

  const refresh_module_data = () => {
    context_send_module_data();
  };

  React.useEffect(() => {
    set_state_module_data(context_module_data);
    set_state_last_sync(Util.get_time_hms());
  }, [context_module_data]);

  React.useEffect(() => {
    ref_auto_sync.current.state_sync_interval = state_sync_interval;
    ref_auto_sync.current.state_auto_sync = state_auto_sync;

    const async_auto_sync = () => {
      const auto_sync = ref_auto_sync.current.state_auto_sync;
      if (auto_sync === true) refresh_module_data();

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
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          <input
            name="hello"
            type="checkbox"
            checked={state_auto_sync}
            onChange={e => {
              set_state_auto_sync(e.target.checked);
            }}
          />
          <input
            className="input_value"
            key="interval_value"
            name="interval_value"
            type="number"
            value={state_sync_interval}
            min={MIN_INTERVAL}
            max={MAX_INTERVAL}
            step={100}
            onChange={e => {
              const value = e.target.value;
              if (value >= MIN_INTERVAL && value <= MAX_INTERVAL)
                set_state_sync_interval(value);
            }}
          />
          <button className="process" onClick={refresh_module_data}>
            refresh
          </button>
          <label>{`Last sync: ${state_last_sync}`}</label>
        </div>
        <ReactJson
          name="ModuleData"
          src={state_module_data}
          theme="monokai"
          indentWidth={2}
          collapsed={true}
        />
      </div>
    </React.Fragment>
  );
}

export default ModuleData;
