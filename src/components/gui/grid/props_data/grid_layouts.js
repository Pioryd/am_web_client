export default {
  className: "layout",
  items: 3,
  rowHeight: 3,
  width: 1200,
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 1 },
  layouts: {
    lg: [
      { i: "0", x: 0, y: 0, w: 2, h: 45 },
      { i: "1", x: 2, y: 0, w: 2, h: 45 },
      { i: "2", x: 4, y: 0, w: 2, h: 45 }
    ]
  }
};
