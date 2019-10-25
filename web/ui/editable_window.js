/**
 * @description Main class of editable window. Every other sub-windows as
 * content bosy must be added to one of editable window.
 */
export class EditableWindow {
  constructor(uid, title) {
    this.title = title;
    this.ui_window = {};
    this.ui_window_bar = {};
    this.ui_window_content = {};
    this.content_ui = {};

    // Setup window
    this.ui_window = document.createElement("div");
    this.ui_window.setAttribute("id", `editable_window_${uid}`);
    this.ui_window.setAttribute("class", `editable-window`);
    document.body.appendChild(this.ui_window);

    // Setup window bar
    this.ui_window_header = document.createElement("div");
    this.ui_window_header.setAttribute("id", `editable_window-bar_${uid}`);
    this.ui_window_header.setAttribute("class", `topbar`);
    this.ui_window_header.innerHTML = title;
    this.ui_window.appendChild(this.ui_window_header);

    // Setup window content
    this.ui_window_content = document.createElement("div");
    this.ui_window_content.setAttribute("id", `editable_window_content_${uid}`);
    this.ui_window_content.setAttribute("class", `contentbody`);
    this.ui_window.appendChild(this.ui_window_content);

    // Setup editable events
    set_window_editable(this.ui_window, this.ui_window_header);
  }

  set_content_ui(ui) {
    this.content_ui = ui;
    this.ui_window_content.appendChild(this.content_ui.ui_window);
  }
}

export function make_window_top(work_window) {
  // Make window the TOP
  let current_z_index = Number(work_window.style.zIndex);
  for (let i = 0; i < document.body.children.length; i++) {
    const child = document.body.children[i];
    const child_z_index = Number(child.style.zIndex);
    if (
      child.id != work_window.id &&
      child.id.includes("window_") &&
      child_z_index >= current_z_index
    ) {
      current_z_index = child_z_index + 1;
    }
  }
  work_window.style.zIndex = String(current_z_index);

  // TODO
  // Safari have lowest max z-index = 16777271 and others 2147483647
  // After that max value z-index order will break
}

/**
 * @description Make editable window editable, moveable, minimizing,
 *  control focuse as z-index
 * @param {document.Element} window_body
 * @param {document.Element} window_bar
 */
function set_window_editable(window_body, window_bar) {
  let distance_x = 0;
  let distance_y = 0;
  let last_position_x = 0;
  let last_position_y = 0;

  window_body.onmousedown = e => {
    make_window_top(window_body);
  };

  window_bar.ondblclick = e => {
    e = e || window.event;
    e.preventDefault();

    if (window_body.style.height != "30px") window_body.style.height = "30px";
    else window_body.style.height = "50%";

    if (window_body.style.width != "200px") window_body.style.width = "200px";
    else window_body.style.width = "200px";
  };

  window_bar.onmousedown = e => {
    e = e || window.event;
    e.preventDefault();

    last_position_x = e.clientX;
    last_position_y = e.clientY;

    document.onmouseup = e => {
      e = e || window.event;
      e.preventDefault();

      document.onmouseup = null;
      document.onmousemove = null;
    };

    document.onmousemove = e => {
      e = e || window.event;
      e.preventDefault();

      distance_x = last_position_x - e.clientX;
      distance_y = last_position_y - e.clientY;
      last_position_x = e.clientX;
      last_position_y = e.clientY;

      let top = window_body.offsetTop - distance_y;
      let left = window_body.offsetLeft - distance_x;

      if (top < 15) top = 15;
      if (left < 0) left = 0;

      window_body.style.top = top + "px";
      window_body.style.left = left + "px";
    };
  };
}
