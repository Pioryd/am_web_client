import ViewData from "./components/view_data";
import ViewSource from "./components/view_source";
import GraphicalUI from "./components/graphical_ui";
import Chat from "./components/chat";
import EditData from "./components/edit_data";
import VirtualWorld from "./components/virtual_world";

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
