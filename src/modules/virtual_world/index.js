import actions from "./windows/actions";
import map from "./windows/map";
import statistics from "./windows/statistics";
import api from "./windows/api";

export default {
  windows_map: {
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
        { i: "0", x: 0, y: 0, w: 3, h: 10 },
        { i: "1", x: 0, y: 5, w: 3, h: 45 },
        { i: "2", x: 3, y: 0, w: 2, h: 55 },
        { i: "3", x: 5, y: 0, w: 6, h: 20 },
        { i: "4", x: 5, y: 20, w: 6, h: 35 }
      ]
    }
  }
};
