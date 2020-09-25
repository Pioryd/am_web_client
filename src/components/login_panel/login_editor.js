import React from "react";
import Select from "react-select";
import AceEditor from "react-ace";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import useSelectHook from "../../hooks/select_hook";
import Util from "../../framework/util";
import { AppContext } from "../../context/app";
import Modules from "../../modules";

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

import "./index.css";

const create_label = (object) => `${object.name} @ ${object.id}`;

function LoginEditor(props) {
  const { __context_app_sessions, context_app_fn } = React.useContext(
    AppContext
  );

  const {
    hook_select_current_value,
    hook_select_options,
    hook_select_selected_option,
    hook_select_fn
  } = useSelectHook({
    default_value: "",
    create_label
  });

  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_error, __set_state_error] = React.useState("");
  const [
    state_current_session_data,
    set_state_current_session_data
  ] = React.useState(null);
  const [
    state_current_session_id,
    set_state_current_session_id
  ] = React.useState(null);

  const set_error = (message) =>
    __set_state_error(
      message === "" ? "" : `[${Util.get_time_hms(new Date())}] ${message}`
    );

  const update_session = (session) => {
    set_state_draft_mode(true);
    set_state_current_session_data(session);
  };

  const button = {
    refresh: () => {
      try {
        const sessions = context_app_fn._get_sessions();

        let current_label = null;
        const session = sessions[state_current_session_id];
        if (session != null && session.settings != null) {
          current_label = create_label({
            id: state_current_session_id,
            name: session.settings.name
          });
        }

        const options = [];
        for (const [id, data] of Object.entries(sessions)) {
          try {
            options.push({ id, name: data.settings.name });
          } catch (e) {
            context_app_fn.remove_session(id);
          }
        }
        hook_select_fn.update(options, current_label);
      } catch (e) {
        set_error(`Unable to refresh. ${e.message}`);
      }
    },
    save: () => {
      try {
        set_error("");
        if (hook_select_selected_option.value == null)
          throw new Error("No option is selected.");

        const session = JSON.parse(state_current_session_data);
        if (session.settings.name === "" || session.settings.name == null)
          throw new Error(`Missing [session.settings.name].`);

        if (hook_select_selected_option !== null) {
          if (props.show == null) {
            context_app_fn.override_session(session, state_current_session_id);
          } else {
            context_app_fn.update_session(session, state_current_session_id);
          }
        }

        set_state_draft_mode(false);
      } catch (e) {
        set_error(`Unable to save. ${e.message}`);
      }
    },
    add: () => {
      try {
        const session_id = uuidv4();
        context_app_fn.add_session(session_id, {
          settings: { name: "new", module: "", description: "" },
          root: { connection: { accept_data: { login: "", password: "" } } }
        });
        set_state_current_session_id(session_id);
      } catch (e) {
        set_error(`Unable to add. ${e.message}`);
      }
    },
    remove: () => {
      try {
        if (state_current_session_id === null) return;

        context_app_fn.remove_session(state_current_session_id);
      } catch (e) {
        set_error(`Unable to remove. ${e.message}`);
      }
    },
    login: () => {
      try {
        if (state_current_session_id == null)
          throw new Error("Session ID is not set.");

        const session = context_app_fn._get_session(state_current_session_id);
        const modules = Object.keys(Modules);
        if (!modules.includes(session.settings.module))
          throw new Error(
            `[settings.module] is not set. Correct values[${modules}]`
          );

        // can be string, so ==
        const { host, port } = session.root.connection;
        if (host == 0 || host == null)
          throw new Error(`Missing [root.connection.host].`);
        if (port == 0 || port == null)
          throw new Error(`Missing [root.connection.port].`);

        context_app_fn.set_current_session(state_current_session_id);
      } catch (e) {
        set_error(`Unable to login. ${e.message}`);
      }
    }
  };

  const handle_select_session = (id) => {
    const session = context_app_fn._get_session(id);
    set_state_current_session_data(
      JSON.stringify(
        props.show == null ? session : _.pick(session, props.show),
        null,
        2
      )
    );
    set_state_current_session_id(hook_select_current_value.id);
  };

  React.useEffect(() => {
    handle_select_session(hook_select_current_value.id);
  }, [hook_select_current_value]);

  React.useEffect(() => {
    button.refresh();
  }, [__context_app_sessions]);

  return (
    <React.Fragment>
      <div className="A8t_buttons">
        <button onClick={button.refresh}>Refresh</button>
        <button onClick={button.save}>Save</button>
        <button onClick={button.add}>Add</button>
        <button onClick={button.remove}>Remove</button>
      </div>
      <div className="A8t_select-data">
        <Select
          styles={{
            // Fixes the overlapping problem of the component
            menu: (provided) => ({ ...provided, zIndex: 9999 })
          }}
          value={hook_select_selected_option}
          placeholder={`Select login data... [${
            Object.keys(hook_select_options).length
          }]`}
          onChange={hook_select_fn.on_change}
          options={hook_select_options}
          isClearable={true}
        />
      </div>
      <span className="A8t_error-text">
        {state_error !== "" && props.show == null && "Error. Check log below."}
      </span>
      {hook_select_current_value !== "" &&
        Object.keys(hook_select_current_value).length > 0 && (
          <div className="A8t_edit-data">
            {
              <AceEditor
                mode="json"
                theme="textmate"
                name="editor_name"
                onChange={update_session}
                value={state_current_session_data}
                setOptions={{
                  useSoftTabs: false,
                  tabSize: 2,
                  fontSize: 14
                }}
              />
            }
          </div>
        )}

      {state_draft_mode !== true &&
      hook_select_current_value !== "" &&
      state_error === "" &&
      hook_select_current_value !== "" &&
      Object.keys(hook_select_current_value).length > 0 ? (
        <button className="A8t_big-button" onClick={button.login}>
          Login
        </button>
      ) : (
        <div>
          {hook_select_current_value === "" && (
            <div className="A8t_error-text">No selected option</div>
          )}
          {state_error !== "" && (
            <div className="A8t_error-text">{state_error}</div>
          )}
          {state_draft_mode === true && (
            <div className="A8t_error-text">Save to leave draft mode</div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default LoginEditor;
