import RunScript from "./components/run_script";
import ScriptsList from "./components/scripts_list";
const windows_map = {
  admin_run_script: { class: RunScript, title: "Run script" },
  admin_scripts_list: { class: ScriptsList, title: "Scripts list" }
};

export default { windows_map };
