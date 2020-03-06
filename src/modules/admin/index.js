import FormEditor from "./components/form_editor";
import CodeEditor from "./components/code_editor";
import ModuleData from "./components/module_data";
import RunScript from "./components/run_script";
import ScriptsList from "./components/scripts_list";

export default {
  windows_map: {
    form_editor: { class: FormEditor, title: "Form editor" },
    code_editor: { class: CodeEditor, title: "Code editor" },
    module_data: { class: ModuleData, title: "Module data" },
    admin_run_script: { class: RunScript, title: "Run script" },
    admin_scripts_list: { class: ScriptsList, title: "Scripts list" }
  }
};
