import { MainWindow } from "../web/ui/main_window.js";
import { Radar } from "../web/ui/radar.js";
import { Default } from "../web/ui/default.js";
import { RadarFormEdit } from "../web/ui/radar_form_edit.js";
import { Client } from "../web/client.js";

/**
 * @description Contains things related to GUI. Connect server data via sockets.
 */
class GUI {
  constructor() {
    this.web_client = new Client(
      "http://localhost:3000",
      this.create_parse_dict_()
    );
    this.ui_main_window = new MainWindow();
    this.ui_radar = {};
    this.ui_radar_preview = {};

    this.setup_gui();
  }

  setup_gui() {
    // Main window
    this.ui_main_window.reset();
    this.ui_main_window.on_sync_button = () => {
      if (this.web_client.is_connected()) {
        this.web_client.disconnect();
      } else {
        this.web_client.connect();
        this.web_client.send("radar", { command: "update" });
      }
    };
    this.ui_main_window.on_change_sync_interval = interval => {
      this.web_client.sync_interval = interval;
    };
    setInterval(() => {
      // Check connection and set sync button on main bar
      this.ui_main_window.update_sync_button(this.web_client.is_connected());
    }, 100);

    // Radar
    this.ui_radar = new Radar(this.ui_main_window.create_window("Radar"), {});
    this.ui_radar.on_tooltip_click = point_name => {
      this.ui_radar_edit.set_current_form_by_name(point_name);
    };
    this.ui_main_window.set_content_ui(this.ui_radar);
    // Radar - source preview
    this.ui_radar_preview = new Default(
      this.ui_main_window.create_window("Radar - source preview"),
      {}
    );
    this.ui_main_window.set_content_ui(this.ui_radar_preview);

    // Radar - form edit
    this.ui_radar_edit = new RadarFormEdit(
      this.ui_main_window.create_window("Radar from edit"),
      {}
    );
    this.ui_radar_edit.on_edit_form = edited_form => {
      this.web_client.send("radar", {
        command: "edit_form",
        form: edited_form
      });
    };
    this.ui_radar_edit.on_remove_form = form_name => {
      this.web_client.send("radar", {
        command: "remove_form",
        form: { name: form_name }
      });
    };
    this.ui_radar_edit.on_set_as_center = center_data => {
      this.ui_radar.set_center(center_data);
    };
    this.ui_main_window.set_content_ui(this.ui_radar_edit);
  }

  /**
   * @description Functions to parse incoming packets and send response with
   *  configurable delay.
   * @returns {dict<String, Function>} Key: Packet ID, Value: Function to parse
   */
  create_parse_dict_() {
    let parse_dict = {};

    parse_dict["radar"] = packet => {
      let data = null;

      if (packet["command"] === "update") {
        this.ui_radar.update(packet.points, packet.map_size);
        this.ui_radar_preview.update(packet.points);
        this.ui_radar_edit.update(packet.points);
        data = {};
        data.command = "update";
      } else if (packet["command"] === "edit_form") {
        this.ui_radar_edit.set_log(packet.log);
      } else if (packet["command"] === "remove_form") {
        this.ui_radar_edit.set_log(packet.log);
      } else if (packet["command"] === "delete_form") {
        this.ui_radar_edit.set_log(packet.log);
      }
      return data;
    };

    return parse_dict;
  }
}

const gui = new GUI();
