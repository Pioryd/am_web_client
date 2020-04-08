import React from "react";
import JsonData from "../components/json_data";

function ModuleData() {
  return (
    <div className="content_body">
      <JsonData
        packet_name="module_data"
        auto_sync={true}
        refresh={true}
        clear={false}
      />
    </div>
  );
}

export default ModuleData;
