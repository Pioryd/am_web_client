import ViewData from "./windows/view_data";
import ViewSource from "./windows/view_source";
import GraphicalUI from "./windows/graphical_ui";
import Chat from "./windows/chat";
import EditData from "./windows/edit_data";
import VirtualWorld from "./windows/virtual_world";

export default {
  windows_map: {
    view_data: { class: ViewData, title: "View data" },
    view_source: { class: ViewSource, title: "View source" },
    chat: { class: Chat, title: "Chat" },
    edit_data: { class: EditData, title: "Edit data" },
    virtual_world: { class: VirtualWorld, title: "Virtual world" },
    graphical_ui: { class: GraphicalUI, title: "Graphical UI" }
  }
};
