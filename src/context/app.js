import React from "react";
import { diff } from "deep-object-diff";
import _ from "lodash";

export const AppContext = React.createContext();

const LOCAL_STORAGE_NAME = "am_web_client";

const CORE_SETTINGS = {
  accept_connection_data: {},
  main_loop_sleep: 500,
  reconnect_attempts_interval: 1000,
  packet_send_delay: 0,
  packet_timeout: 0,
  host: "localhost",
  port: "3000",
  module: "admin",
  start_as_connection_enabled: 1
};

const AppProvider = ({ children }) => {
  const [state_data, __set_state_data] = React.useState({});
  const set_state_data = (data) =>
    __set_state_data({ session_data: {}, ...data });

  const [
    state_current_session_data,
    __set_state_current_session_data
  ] = React.useState({});
  const set_state_current_session_data = (data = {}) => {
    let _settings = data._settings || {};
    data._settings = { ..._.cloneDeep(CORE_SETTINGS), ..._settings };
    __set_state_current_session_data(data);
  };
  const [
    state_current_session_id,
    set_state_current_session_id
  ] = React.useState(null);

  const load_data = () => {
    try {
      set_state_data({
        ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
      });
    } catch (e) {
      localStorage.removeItem(LOCAL_STORAGE_NAME);
    }
  };

  const save_data = () =>
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state_data));

  React.useEffect(() => load_data(), []);
  React.useEffect(() => save_data(), [state_data]);

  const value = {
    context_app_data: state_data,
    context_app_session_data: state_current_session_data,
    context_app_session_id: state_current_session_id,
    context_app_fn: {
      override_data: (data) => {
        const app_data = { ...data };
        set_state_current_session_data(
          app_data.session_data[state_current_session_id]
        );
        set_state_data(app_data);
      },
      update_data: (data) => {
        const app_data = { ...state_data, ...data };
        set_state_current_session_data(
          app_data.session_data[state_current_session_id]
        );
        set_state_data(app_data);
      },
      override_session: (data, session_id) => {
        const current_session_id = session_id || state_current_session_id;
        const app_data = { ...state_data };

        if (app_data.session_data[current_session_id] == null) return;

        app_data.session_data[current_session_id] = { ...data };

        if (session_id != null)
          set_state_current_session_id(current_session_id);
        set_state_current_session_data(
          app_data.session_data[current_session_id]
        );
        set_state_data(app_data);
      },
      update_session: (data, session_id) => {
        const current_session_id = session_id || state_current_session_id;
        let current_session_data =
          state_data.session_data[current_session_id] || {};

        if (current_session_data == null) return;

        current_session_data = { ...current_session_data, ...data };

        const app_data = { ...state_data };
        app_data.session_data[current_session_id] = current_session_data;

        if (session_id != null)
          set_state_current_session_id(current_session_id);
        set_state_current_session_data(current_session_data);
        set_state_data(app_data);
      },
      diff_session_data: (old_data) => {
        if (state_current_session_id == null)
          return { diff: null, old: null, current: null };
        const current_data = state_data.session_data[state_current_session_id];
        const result = diff(old_data, current_data);

        return {
          diff: Object.keys(result).length > 0 ? result : null,
          old: old_data,
          current: current_data
        };
      }
    }
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
