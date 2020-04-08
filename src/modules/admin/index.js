import AM_ScriptEditor from "./windows/am_editor_script";
import AM_FormEditor from "./windows/am_editor_form";
import AM_ProgramEditor from "./windows/am_editor_program";
import AM_SystemEditor from "./windows/am_editor_system";
import ModuleData from "./windows/module_data";
import ModuleInfo from "./windows/module_info";
import AdminScripts from "./windows/admin_scripts";

export default {
  windows_map: {
    script_editor: { class: AM_ScriptEditor, title: "AM editor - Script" },
    form_editor: { class: AM_FormEditor, title: "AM editor - Form" },
    program_editor: { class: AM_ProgramEditor, title: "AM editor - Program" },
    system_editor: { class: AM_SystemEditor, title: "AM editor - System" },
    module_data: { class: ModuleData, title: "Module data" },
    module_info: { class: ModuleInfo, title: "Module info" },
    admin_scripts: { class: AdminScripts, title: "Admin scripts" }
  }
};
