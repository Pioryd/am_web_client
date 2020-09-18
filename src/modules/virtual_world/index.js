import actions from "./windows/actions";
import map from "./windows/map";
import statistics from "./windows/statistics";
import api from "./windows/api";

export default {
  windows: {
    world_map: { class: map, title: "World Map" },
    statistics: { class: statistics, title: "Objects Statistics" },
    api: { class: api, title: "Execute Api" },
    actions: { class: actions, title: "World Actions" }
  },
  grid_layouts: {
    className: "layout",
    items: 5,
    rowHeight: 3,
    width: 1200,
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 1 },
    layouts: {
      lg: [
        { i: "0", x: 0, y: 5, w: 1.5, h: 55 },
        { i: "1", x: 1.5, y: 0, w: 1.5, h: 55 },
        { i: "2", x: 3, y: 0, w: 6, h: 55 },
        { i: "3", x: 9, y: 0, w: 3, h: 55 }
      ]
    }
  },
  gui_type: "grid",
  navigation_enabled_windows_list: false
};
