import React from "react";
import Client from "../framework/client";

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state_packet, set_state_packet] = React.useState();
  const [state_log, set_state_log] = React.useState("");
  const [state_client, set_state_client] = React.useState();

  const create_parse_dict_ = () => {
    let parse_dict = {};

    parse_dict["radar"] = packet => {
      set_state_packet(packet);

      let data = null;

      if (packet["command"] === "update") {
        data = {};
        data.command = "update";
      } else if (packet["command"] === "edit_form") {
        set_state_log(packet.log);
      } else if (packet["command"] === "remove_form") {
        set_state_log(packet.log);
      } else if (packet["command"] === "delete_form") {
        set_state_log(packet.log);
      }
      return data;
    };

    return parse_dict;
  };

  const toggle_sync = value => {
    if (value === true) {
      state_client.connect();
      state_client.send("radar", { command: "update" });
    } else {
      state_client.disconnect();
    }
  };

  const change_sync_interval = interval => {
    state_client.sync_interval = interval;
  };

  const edit_form = edited_form => {
    state_client.send("radar", {
      command: "edit_form",
      form: edited_form
    });
  };

  const remove_form = form_name => {
    state_client.send("radar", {
      command: "remove_form",
      form: form_name
    });
  };

  React.useEffect(() => {
    set_state_client(new Client("http://localhost:3000", create_parse_dict_()));
  }, []);

  const value = {
    context_on_toggle_sync: value => toggle_sync(value),
    context_on_change_sync_interval: change_sync_interval,
    context_on_edit_form: edit_form,
    context_on_remove_form: remove_form,
    context_source: state_packet,
    context_log: state_log,
    contextValue: "default value"
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
