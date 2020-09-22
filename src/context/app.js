import React from "react";
import { diff } from "deep-object-diff";
import _ from "lodash";
import core_settings from "../app_settings";
import Modules from "../modules";

export const AppContext = React.createContext();

const LOCAL_STORAGE_NAME = "am_web_client";

/**
 * Session structure
 * {
 *  settings: {}, // session settings
 *  root: {}, // root/components,context,hooks settings
 *  module: {} // module settings
 * }
 */
const AppProvider = ({ children }) => {
  const [state_sessions, set_state_sessions] = React.useState({});
  const [
    state_current_session_id,
    set_state_current_session_id
  ] = React.useState(null);

  const load_data = () => {
    try {
      set_state_sessions({
        ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
      });
    } catch (e) {
      localStorage.removeItem(LOCAL_STORAGE_NAME);
    }
  };

  const save_data = () =>
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state_sessions));

  React.useEffect(() => load_data(), []);
  React.useEffect(() => {
    save_data();
    if (state_sessions[state_current_session_id] == null)
      set_state_current_session_id(null);
  }, [state_sessions]);

  const value = {
    __context_app_sessions: _.cloneDeep(state_sessions),
    context_app_session_data: _.cloneDeep(
      state_sessions[state_current_session_id]
    ),
    context_app_session_id: state_current_session_id,
    context_app_fn: {
      _get_sessions: () => {
        return _.cloneDeep(state_sessions);
      },
      _set_sessions: (sessions) => {
        set_state_sessions(_.cloneDeep(sessions));
      },
      _get_session: (id) => {
        return _.cloneDeep(state_sessions[id]);
      },
      set_current_session: (id) => {
        let session = state_sessions[id];
        if (session == null) {
          console.trace("Unable to set current session.");
          return;
        }

        const core_session_data = _.cloneDeep({
          settings: {},
          root: core_settings,
          module: Modules[session.settings.module].settings
        });

        session = _.merge(core_session_data, session);

        const sessions = { ...state_sessions };
        sessions[id] = session;
        set_state_sessions(sessions);

        set_state_current_session_id(id);
      },
      add_session: (id, data) => {
        if (id in state_sessions) {
          console.trace("Unable to add session.");
          return;
        }
        const session = {
          settings: {},
          root: _.cloneDeep(core_settings),
          module: {}
        };
        _.merge(session, _.cloneDeep(data));

        const sessions = { ...state_sessions };
        sessions[id] = session;
        set_state_sessions(sessions);
      },
      remove_session: (id) => {
        if (state_sessions[id] == null) {
          console.trace("Unable to remove session.");
          return;
        }

        const sessions = { ...state_sessions };
        delete sessions[id];
        set_state_sessions(sessions);
      },
      override_session: (data, id) => {
        id = id || state_current_session_id;
        if (id == null) {
          console.trace("Unable to override session.");
          return;
        }

        const sessions = { ...state_sessions };
        sessions[id] = _.cloneDeep(data);
        set_state_sessions(sessions);
      },
      update_session: (data, id) => {
        id = id || state_current_session_id;
        if (id == null) {
          console.trace("Unable to update session.");
          return;
        }

        const sessions = { ...state_sessions };
        const session = _.cloneDeep(sessions[id]);

        _.merge(session, data);

        sessions[id] = session;
        set_state_sessions(sessions);
      },
      diff_session: (data, id) => {
        id = id || state_current_session_id;
        if (id == null) {
          console.trace("Unable to diff session.");
          return { diff: null, old: null, current: null };
        }

        const result = diff(data, state_sessions[id]);

        return {
          diff: Object.keys(result).length > 0 ? result : null,
          old: data,
          current: _.cloneDeep(state_sessions[id])
        };
      }
    }
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
