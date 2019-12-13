import React from "react";
import Client from "../../framework/client";
import ParsePacket from "./parse_packet";
import SendPacket from "./send_packet";

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state_packet, set_state_packet] = React.useState();
  const [state_client, set_state_client] = React.useState();

  const create_parse_dict = () => {
    return {
      world: packet => {
        set_state_packet(packet);
        if (packet.command in ParsePacket)
          return ParsePacket[packet.command](packet, this);
      }
    };
  };

  const toggle_sync = value => {
    if (value === true) {
      state_client.connect();
      SendPacket.update(state_client);
    } else {
      state_client.disconnect();
    }
  };

  const change_sync_interval = interval => {
    state_client.sync_interval = interval;
  };

  React.useEffect(() => {
    set_state_client(new Client("http://localhost:3000", create_parse_dict()));
  }, []);

  const value = {
    context_on_toggle_sync: value => toggle_sync(value),
    context_on_change_sync_interval: change_sync_interval,
    context_change_position: (...args) => {
      SendPacket.change_position(state_client, ...args);
    },
    context_change_land: (...args) => {
      SendPacket.change_land(state_client, ...args);
    },
    context_add_friend: (...args) => {
      SendPacket.add_friend(state_client, ...args);
    },
    context_source: state_packet,
    contextValue: "default value"
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
