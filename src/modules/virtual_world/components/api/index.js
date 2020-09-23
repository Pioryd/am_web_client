import React from "react";
import Select from "react-select";
import AceEditor from "react-ace";
import useSelectHook from "../../../../hooks/select_hook";
import { ConnectionContext } from "../../../../context/connection";
import Util from "../../../../framework/util";

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

import "./index.css";

const PACKET_NAME = "data_mirror";
const DEFAULT_INTERVAL = 1000;
const MIN_INTERVAL = 10;
const MAX_INTERVAL = 10000;
const API_EXAMPLE = { api: "", data: {} };

function Api(props) {
  const {
    context_connection_packets_data,
    context_connection_fn
  } = React.useContext(ConnectionContext);
  const ref_auto_sync = React.useRef({});
  const {
    hook_select_current_value,
    hook_select_options,
    hook_select_selected_option,
    hook_select_fn
  } = useSelectHook({
    default_value: "",
    create_label: (object) => {
      return object.id;
    }
  });
  const [state_current_object, set_state_current_object] = React.useState("");
  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_sync_interval, set_state_sync_interval] = React.useState(
    DEFAULT_INTERVAL
  );
  const [state_source, set_state_source] = React.useState("");
  const [state_validate_error, set_state_validate_error] = React.useState("");
  const parse_packet = () => {
    const packets = context_connection_fn.peek(PACKET_NAME);
    if (packets.length === 0) return;
    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());
    const select_objects = [];
    for (const id of Object.keys(packet.mirror.objects))
      select_objects.push({ id });
    let current_object = null;
    for (const object of select_objects)
      if (object.id === state_current_object.id) current_object = object;
    hook_select_fn.update(select_objects, current_object);
  };
  const auto_sync = () => {
    if (props.auto_sync === false) return;
    ref_auto_sync.current.state_sync_interval = state_sync_interval;
    const async_auto_sync = () => {
      context_connection_fn.send(PACKET_NAME);
      ref_auto_sync.current.timeout = setTimeout(() => {
        async_auto_sync();
      }, ref_auto_sync.current.state_sync_interval);
    };
    async_auto_sync();
    return () => {
      clearTimeout(ref_auto_sync.current.timeout);
    };
  };
  const set_example_api = () => {
    set_state_source(JSON.stringify(API_EXAMPLE, null, 2));
    set_state_validate_error("");
  };
  const validate_api = () => {
    try {
      set_state_source(JSON.stringify(JSON.parse(state_source), null, 2));
      set_state_validate_error("");
      return true;
    } catch (e) {
      set_state_validate_error("Unable to validate");
    }
    return false;
  };
  const process_api = () => {
    if (validate_api() === true) {
      const { api, data } = JSON.parse(state_source);
      context_connection_fn.send("process_api", {
        object_id: state_current_object.id,
        api,
        timeout: 0,
        args: data
      });
    } else {
      set_state_validate_error("Unable to PROCESS. Api format is not valid.");
    }
  };
  const on_change = (source) => set_state_source(source);
  React.useEffect(() => parse_packet(), [context_connection_packets_data]);
  React.useEffect(() => auto_sync(), []);
  React.useEffect(() => {
    ref_auto_sync.current.state_sync_interval = state_sync_interval;
  }, [state_sync_interval]);
  React.useEffect(() => set_state_current_object(hook_select_current_value), [
    hook_select_current_value
  ]);
  return (
    <div className="content_body">
      <div className="bar">
        <label>Interval:</label>
        <input
          className="input_value"
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
        <label>{`Last sync: ${state_last_sync}`}</label>
        <button onClick={set_example_api}>Example</button>
        <button onClick={validate_api}>Validate</button>
        <button onClick={process_api}>Process</button>
      </div>
      <Select
        styles={{
          // Fixes the overlapping problem of the component
          menu: (provided) => ({ ...provided, zIndex: 9999 })
        }}
        value={hook_select_selected_option}
        placeholder={`Select object... [${
          Object.keys(hook_select_options).length
        }]`}
        onChange={hook_select_fn.on_change}
        options={hook_select_options.sort((a, b) =>
          a.value.id.localeCompare(b.value.id)
        )}
        isClearable={true}
        maxMenuHeight={150}
      />
      {state_validate_error !== "" && (
        <label className="error">{state_validate_error}</label>
      )}
      <div className="editor">
        <div className="area">
          <AceEditor
            width="100%"
            height="100%"
            mode="json"
            theme="monokai"
            name="editor_name"
            onChange={on_change}
            value={state_source}
          />
        </div>
      </div>
    </div>
  );
}

export default Api;
