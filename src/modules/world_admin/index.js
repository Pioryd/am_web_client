import ModuleData from "./components/module_data";
import RunScript from "./components/run_script";
import ScriptsList from "./components/scripts_list";

const windows_map = {
  module_data: { class: ModuleData, title: "Module data" },
  admin_run_script: { class: RunScript, title: "Run script" },
  admin_scripts_list: { class: ScriptsList, title: "Scripts list" }
};

export default { windows_map };
