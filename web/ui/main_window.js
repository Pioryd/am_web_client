import { EditableWindow, make_window_top } from "./editable_window.js";

/**
 * @description Is container for editable windows. Contains bar with
 *  functionality to control GUI client.
 *  Every child editable window must contains:
 *    - set_content_ui()
 *    - uid - uid given by main window
 *    - ui_window - as root element
 *    - source (optional) - source received from server to parse
 *    - update() (optional) - function to update from source
 *
 */
export class MainWindow {
  constructor() {
    this.reset();
  }

  /**
   * @description Create and return uid of editable window.
   * @param {String} title Window title
   * @returns {Number} uid of editable window.
   */
  create_window(title) {
    this.last_uid++;
    const editable_window = new EditableWindow(this.last_uid, title);
    this.windows[this.last_uid] = editable_window;

    this.toggle_window_list();

    return this.last_uid;
  }

  /**
   * @description Create and return uid of editable window.
   * @param {String} ui Window title
   */
  set_content_ui(ui) {
    this.windows[ui.uid].set_content_ui(ui);
  }

  reset() {
    this.on_sync_button = () => {};
    this.on_change_sync_interval = () => {};

    // dict<Number, EditableWindow> Key: UID, Value: Editable Window instance
    this.windows = {};
    // Auto UID
    this.last_uid = 0;
    document.body.innerHTML = "";

    // Setup main window content as top bar
    this.ui_main_bar = document.createElement("div");
    this.ui_main_bar.setAttribute("id", `main-window-bar_1`);
    this.ui_main_bar.setAttribute("class", `main-window-bar`);
    document.body.appendChild(this.ui_main_bar);

    // Add button - toggle sync
    this.toggle_sync = document.createElement("div");
    this.toggle_sync.setAttribute("class", `barbtn`);
    this.toggle_sync.onclick = e => {
      e = e || window.event;
      e.preventDefault();

      this.on_sync_button();
    };
    this.ui_main_bar.appendChild(this.toggle_sync);

    // Add input - sync interval
    this.sync_interval = document.createElement("INPUT");
    this.sync_interval.setAttribute("class", `barinput`);
    this.sync_interval.setAttribute("type", "number");
    this.sync_interval.max = 2000;
    this.sync_interval.min = 100;
    this.sync_interval.step = this.sync_interval.min;
    this.sync_interval.defaultValue = this.sync_interval.max;
    this.sync_interval.value = this.sync_interval.max;
    this.sync_interval.onkeydown = () => {
      return false;
    };
    this.sync_interval.onchange = () => {
      this.on_change_sync_interval(this.sync_interval.value);
    };
    this.ui_main_bar.appendChild(this.sync_interval);

    // Add dropdown - windows list to bar
    this.dropdown = document.createElement("div");
    this.dropdown.setAttribute("class", `dropdown-list`);
    this.ui_main_bar.appendChild(this.dropdown);

    // Add button - windows list to bar
    this.button_toggle_windows = document.createElement("div");
    this.button_toggle_windows.setAttribute("class", `dropbtn`);
    this.button_toggle_windows.innerHTML = "Windows manager";
    this.button_toggle_windows.onclick = e => {
      e = e || window.event;
      e.preventDefault();

      if (
        this.dropdown.style.display === "none" ||
        this.dropdown.style.display === ""
      ) {
        this.toggle_window_list();
        this.dropdown.style.display = "block";
      } else {
        this.dropdown.style.display = "none";
      }
    };
    this.ui_main_bar.appendChild(this.button_toggle_windows);

    this.toggle_window_list();
    this.update_sync_button(false);
  }

  toggle_window_list() {
    this.dropdown.innerHTML = "";

    let color_on = "#06dd58";
    let color_off = "#c0c4c1";

    for (const [uid, editable_window] of Object.entries(this.windows)) {
      let element = document.createElement("div");

      if (editable_window.ui_window.style.display == "block")
        element.style.backgroundColor = color_on;
      else element.style.backgroundColor = color_off;

      element.innerHTML = editable_window.title;

      element.onclick = e => {
        e = e || window.event;
        e.preventDefault();

        if (editable_window.ui_window.style.display == "block") {
          editable_window.ui_window.style.display = "none";
          element.style.backgroundColor = color_off;
        } else {
          editable_window.ui_window.style.display = "block";
          element.style.backgroundColor = color_on;
          make_window_top(editable_window.ui_window);
        }
      };

      this.dropdown.appendChild(element);
    }
  }

  update_sync_button(connected) {
    if (connected) {
      this.toggle_sync.innerHTML = "Pause sync";
      this.toggle_sync.style.backgroundColor = "#06dd58";
    } else {
      this.toggle_sync.innerHTML = "Restart sync";
      this.toggle_sync.style.backgroundColor = "#ff0000";
    }
  }
}
