/**
 * Display informations about points. Source of point must contains:
 *  - x, y - positions
 *  - name
 *  - background_color
 *  - center (only for first point) - center point of radar
 *  All others informations will described in point's tooltip and map preview ui.
 *  First point is center point, all others points are related to center point.
 */
export class Radar {
  constructor(uid, source) {
    this.uid = uid;
    this.source = source;
    this.options = {
      show_position: true,
      show_info: true,
      zoom: 1,
      lock_center: true
    };
    this.map_size = { width: 1000, height: 1000 };
    this.show_map_size = this.map_size;
    this.center_data = { x: 0, y: 0 };
    this.on_tooltip_click = () => {};

    // Div - window-content
    this.ui_window = document.createElement("div");
    this.ui_window.setAttribute("class", `contentbody`);

    // Div - content-bar
    this.bar = document.createElement("div");
    this.bar.setAttribute("class", `bar`);
    this.ui_window.appendChild(this.bar);

    // Label - lock position
    this.label_lock_position = document.createElement("div");
    this.label_lock_position.innerHTML = "lock";
    this.bar.appendChild(this.label_lock_position);

    // Input - lock position
    this.input_lock = document.createElement("input");
    this.input_lock.type = "checkbox";
    this.input_lock.checked = true;
    this.input_lock.onchange = () => {
      this.options.lock_center = this.input_lock.checked;
    };
    this.bar.appendChild(this.input_lock);

    // Label - center x position
    this.label_center_x = document.createElement("div");
    this.label_center_x.innerHTML = "x:";
    this.bar.appendChild(this.label_center_x);

    // Input - center x position
    this.input_center_x = document.createElement("input");
    this.input_center_x.type = "text";
    this.input_center_x.value = 0;
    this.input_center_x.style.width = "30px";
    this.input_center_x.style.backgroundColor = "#c0c4c1";
    this.input_center_x.onchange = () => {
      delete this.center_data.name;
      this.center_data.x = this.input_center_x.value;
      this.update();
    };
    this.input_center_x.onkeypress = this.input_center_x.onchange;
    this.bar.appendChild(this.input_center_x);

    // Label - center y position
    this.label_center_y = document.createElement("div");
    this.label_center_y.innerHTML = "y:";
    this.bar.appendChild(this.label_center_y);

    // Input - center y position
    this.input_center_y = document.createElement("input");
    this.input_center_y.type = "text";
    this.input_center_y.value = 0;
    this.input_center_y.style.width = "30px";
    this.input_center_y.style.backgroundColor = "#c0c4c1";
    this.input_center_y.onchange = () => {
      delete this.center_data.name;
      this.center_data.y = this.input_center_y.value;
      this.update();
    };
    this.input_center_y.onkeypress = this.input_center_y.onchange;
    this.bar.appendChild(this.input_center_y);

    // Button - zoom-in
    this.button_zoom_in = document.createElement("input");
    this.button_zoom_in.type = "button";
    this.button_zoom_in.value = "zoom-in";
    this.button_zoom_in.onclick = e => {
      this.options.zoom++;

      this.update(this.source);
    };
    this.bar.appendChild(this.button_zoom_in);

    // Button - zoom-out
    this.button_zoom_out = document.createElement("input");
    this.button_zoom_out.type = "button";
    this.button_zoom_out.value = "zoom-out";
    this.button_zoom_out.onclick = e => {
      this.options.zoom = Math.max(1, this.options.zoom - 1);

      this.update(this.source);
    };
    this.bar.appendChild(this.button_zoom_out);

    // Button - enlarge
    this.button_enlarge = document.createElement("input");
    this.button_enlarge.type = "button";
    this.button_enlarge.value = "enlarge";
    this.button_enlarge.onclick = e => {
      let width = parseInt(this.map.style.width.replace("px", ""));
      let height = parseInt(this.map.style.height.replace("px", ""));
      width += 100;
      height += 100;
      this.map.style.width = `${width}px`;
      this.map.style.height = `${height}px`;

      this.update(this.source);
    };
    this.bar.appendChild(this.button_enlarge);

    // Button - reduce
    this.button_reduce = document.createElement("input");
    this.button_reduce.type = "button";
    this.button_reduce.value = "reduce";
    this.button_reduce.onclick = e => {
      let width = parseInt(this.map.style.width.replace("px", ""));
      let height = parseInt(this.map.style.height.replace("px", ""));
      width -= 100;
      height -= 100;
      if (width < 200) width = 200;
      if (height < 200) height = 200;
      this.map.style.width = `${width}px`;
      this.map.style.height = `${height}px`;

      this.update(this.source);
    };
    this.bar.appendChild(this.button_reduce);

    // Button - reset
    this.button_reset = document.createElement("input");
    this.button_reset.type = "button";
    this.button_reset.value = "reset";
    this.button_reset.onclick = e => {
      this.map.style.width = `${this.show_map_size.width}px`;
      this.map.style.height = `${this.show_map_size.height}px`;
      this.options.zoom = 1;

      this.update(this.source);
    };
    this.bar.appendChild(this.button_reset);

    // Button - toggle_info
    this.button_toggle_info = document.createElement("input");
    this.button_toggle_info.type = "button";
    this.button_toggle_info.value = "hide info";
    this.button_toggle_info.onclick = e => {
      if (this.options.show_info) this.button_toggle_info.value = "show info";
      else this.button_toggle_info.value = "hide info";
      this.options.show_info = !this.options.show_info;

      this.update(this.source);
    };
    this.bar.appendChild(this.button_toggle_info);

    // Button - toggle_position
    this.button_toggle_position = document.createElement("input");
    this.button_toggle_position.type = "button";
    this.button_toggle_position.value = "hide pos";
    this.button_toggle_position.onclick = e => {
      if (this.options.show_position)
        this.button_toggle_position.value = "show pos";
      else this.button_toggle_position.value = "hide pos";
      this.options.show_position = !this.options.show_position;

      this.update(this.source);
    };
    this.bar.appendChild(this.button_toggle_position);

    // Label - mouse x position
    this.label_mouse_position = document.createElement("div");
    this.bar.appendChild(this.label_mouse_position);

    // Div - radar-map
    this.map = document.createElement("div");
    this.map.setAttribute("class", `radar-map`);
    this.map.style.width = `${this.show_map_size.width}px`;
    this.map.style.height = `${this.show_map_size.height}px`;
    this.map.onmousemove = e => {
      e = e || window.event;
      e.preventDefault();

      const bounds = this.map.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      this.label_mouse_position.innerHTML = `mouse_position[${x}:${y}]`;
    };
    this.ui_window.appendChild(this.map);

    this.update(this.source);
  }

  set_center(data) {
    this.center_data = data;
  }

  /**
   * @description Update map
   * @param {Object} source (optional) If not given will use last used source.
   */
  update(source, map_size) {
    if (source !== undefined) this.source = source;
    if (map_size !== undefined) this.map_size = map_size;

    if ("name" in this.center_data && this.options.lock_center === false) {
      for (let i = 0; i < this.source.length; i++) {
        if (this.center_data.name == this.source[i].name) {
          this.center_data.x = this.source[i].x;
          this.center_data.y = this.source[i].y;
        }
      }
    }

    this.map.innerHTML = "";
    for (let i = 0; i < this.source.length; i++)
      this.create_point_(this.source[i]);
  }

  create_point_(point) {
    // Const every point size
    const div_size = { width: point.radius * 2, height: point.radius * 2 };

    // Create and setup point div
    const point_div = document.createElement("div");
    point_div.setAttribute("class", `point`);
    point_div.onclick = e => {
      e = e || window.event;
      e.preventDefault();

      this.on_tooltip_click(point.name);
    };
    point_div.style.width = div_size.width + "px";
    point_div.style.height = div_size.height + "px";

    let center_top = 0;
    let center_left = 0;
    // // Get center position of map
    // let center_top =
    //   parseInt(this.map.style.height.replace("px", "")) / 2 -
    //   div_size.height / 2;
    // let center_left =
    //   parseInt(this.map.style.width.replace("px", "")) / 2 - div_size.width / 2;

    // Set position of point
    if (point.center !== undefined && point.center === true) {
      // Center point
      point_div.style.top = center_top + "px";
      point_div.style.left = center_left + "px";
    } else {
      // Any other point
      point_div.style.top = `${center_top -
        this.options.zoom * (this.center_data.x - point.x)}px`;
      point_div.style.left = `${center_left -
        this.options.zoom * (this.center_data.y - point.y)}px`;
    }

    point_div.style.backgroundColor =
      point.color != undefined ? `${point.color}` : "white";

    // Add point display informations (name, position)
    const info_div = document.createElement("div");
    info_div.setAttribute("class", `info`);
    if (this.options.show_info) info_div.innerHTML += `<p>${point.name}</p>`;
    if (this.options.show_position)
      info_div.innerHTML += `<p>x[${point.x}]} y[${point.y}]</p>`;
    point_div.appendChild(info_div);

    this.map.appendChild(point_div);
  }
}
