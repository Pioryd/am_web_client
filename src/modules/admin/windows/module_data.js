import React from "react";
import JsonData from "../components/json_data";

function ModuleData() {
  return (
    <JsonData
      packet_name="module_data"
      auto_sync={true}
      refresh={true}
      clear={false}
    />
  );
}

export default ModuleData;
