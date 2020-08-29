import DataEditor from "./windows/data_editor";
import ModuleData from "./windows/module_data";
import ModuleInfo from "./windows/module_info";
import VisualConnections from "./windows/visual_connections";

export default {
  windows_map: {
    data_editor: { class: DataEditor, title: "Data editor" },
    module_data: { class: ModuleData, title: "Module data" },
    module_info: { class: ModuleInfo, title: "Module info" },
    visual_connections: {
      class: VisualConnections,
      title: "Visual Connections"
    }
  }
};
