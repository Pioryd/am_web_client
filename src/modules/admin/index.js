import FormEditor from "./windows/form_editor";
import ModuleData from "./windows/module_data";
import RunScript from "./windows/run_script";
import ScriptsList from "./windows/scripts_list";

export default {
  windows_map: {
    form_editor: { class: FormEditor, title: "Form editor" },
    module_data: { class: ModuleData, title: "Module data" },
    admin_run_script: { class: RunScript, title: "Run script" },
    admin_scripts_list: { class: ScriptsList, title: "Scripts list" }
  }
};
