import React from "react";

function useStopWatch(props) {
  const [state_start_time, set_start_time] = React.useState(new Date());

  return {
    get_elapsed_milliseconds: () => {
      return new Date() - state_start_time;
    },
    get_elapsed_seconds: () => {
      return (new Date() - state_start_time) / 1000;
    },
    get_elapsed_hours: () => {
      return (new Date() - state_start_time) / 1000 / 60;
    },
    reset: () => {
      set_start_time(new Date());
    }
  };
}

export default useStopWatch;
