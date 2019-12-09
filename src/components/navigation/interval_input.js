import React from "react";
import { AppContext } from "../../context/app_context";

function IntervalInput(props) {
  const { context_on_change_sync_interval } = React.useContext(AppContext);
  const input_config = { min: 100, max: 2000, step: 100, start_interval: 2000 };

  const [state_interval, set_state_interval] = React.useState(
    input_config.start_interval
  );

  const change_sync_interval = value => {
    set_state_interval(value);
    context_on_change_sync_interval(value);
  };

  return (
    <input
      className="barinput"
      type="number"
      min={input_config.min}
      max={input_config.max}
      step={input_config.step}
      value={state_interval}
      onChange={e => {
        change_sync_interval(e.target.value);
      }}
    ></input>
  );
}

export default IntervalInput;
