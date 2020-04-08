import React from "react";
import JsonData from "../components/json_data";

function ModuleInfo() {
  return (
    <div className="content_body">
      <JsonData
        packet_name="module_info"
        auto_sync={true}
        refresh={true}
        clear={false}
      />
    </div>
  );
}

export default ModuleInfo;
