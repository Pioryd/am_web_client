import React from "react";
import Form from "react-jsonschema-form";
import Select from "react-select";
import useSelectHook from "../../hooks/select_hook";
import Util from "../../framework/util";
import form_schema from "./form_schema";

import "./index.css";

function LoginPanel(props) {
  const {
    hook_select_current_value,
    hook_select_options,
    hook_select_selected_option,
    hook_select_fn
  } = useSelectHook({
    default_value: "",
    create_label: object => object.id + "_" + object.name
  });

  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_error, set_state_error] = React.useState("");
  const [
    state_current_login_data,
    set_state_current_login_data
  ] = React.useState(null);
  const [state_login_data_map, set_state_login_data_map] = React.useState(null);

  const set_error = message => {
    set_state_error(
      message === "" ? "" : `[${Util.get_time_hms(new Date())}] ${message}`
    );
  };

  const format_json = current_login_data => {
    if (
      current_login_data != null &&
      Object.keys(current_login_data).length > 0
    )
      try {
        const keys_list = ["accept_connection_data", "settings"];
        for (const key of keys_list) {
          current_login_data[key] = JSON.stringify(
            JSON.parse(current_login_data[key]),
            null,
            2
          );
        }
      } catch (e) {
        set_error(
          `Unable to format json[${current_login_data.id}].` +
            ` Error ${e.message}, ${e.stack}`
        );
      }

    return current_login_data;
  };

  const form_data_changed = ({ formData }) => {
    set_state_draft_mode(true);
    set_state_current_login_data({ ...state_current_login_data, ...formData });
  };

  const button = {
    refresh: () => {
      try {
        set_error("");
        const login_data_map = JSON.parse(
          localStorage.getItem("login_data") || "{}"
        );
        for (const [key, login_data] of Object.entries(login_data_map))
          login_data_map[key] = format_json(login_data);
        set_state_login_data_map(login_data_map);
      } catch (e) {
        set_error(`Unable to refresh. ${e.message} ${e.stack}`);
      }
    },
    save: () => {
      try {
        set_error("");
        const login_data_map = { ...state_login_data_map };
        login_data_map[state_current_login_data.id] = format_json(
          state_current_login_data
        );
        set_state_login_data_map(login_data_map);
        set_state_draft_mode(false);
      } catch (e) {
        set_error(`Unable to refresh. ${e.message} ${e.stack}`);
      }
    },
    add: () => {
      try {
        const login_data_map = { ...state_login_data_map };
        let login_data = {
          id: new Date().getTime(),
          name: "name",
          module: "admin",
          accept_connection_data: `{ "login": "", "password": "" }`,
          host: "localhost",
          port: 0,
          settings: `{"client_timeout":0}`
        };
        login_data = format_json(login_data);
        login_data_map[login_data.id] = login_data;
        set_state_login_data_map(login_data_map);
      } catch (e) {
        set_error(`Unable to add. ${e.message} ${e.stack}`);
      }
    },
    remove: () => {
      try {
        if (state_current_login_data === null) return;

        const login_data_map = { ...state_login_data_map };
        delete login_data_map[state_current_login_data.id];

        set_state_login_data_map(login_data_map);
      } catch (e) {
        set_error(`Unable to remove. ${e.message} ${e.stack}`);
      }
    },
    login: () => {
      try {
        const login_data = {
          ...state_current_login_data,
          accept_connection_data: JSON.parse(
            state_current_login_data.accept_connection_data
          ),
          settings: JSON.parse(state_current_login_data.settings)
        };
        props.set_login_data(login_data);
      } catch (e) {
        set_error(`Unable to login. ${e.message} ${e.stack}`);
      }
    }
  };

  React.useEffect(() => {
    // When new [state_login_data_map]
    // Update [select] [current_login_data] [localStorage]
    if (state_login_data_map === null) return;

    let current_object = null;
    if (
      state_current_login_data != null &&
      Object.keys(state_current_login_data).length > 0
    ) {
      for (const login_data of Object.values(state_login_data_map))
        if (login_data.name === state_current_login_data.name)
          current_object = login_data;
    }

    hook_select_fn.update(state_login_data_map, current_object);
    set_state_current_login_data(current_object);
    localStorage.setItem("login_data", JSON.stringify(state_login_data_map));
  }, [state_login_data_map]);

  React.useEffect(
    () => set_state_current_login_data(hook_select_current_value),
    [hook_select_current_value]
  );

  React.useEffect(() => button.refresh(), []);

  return (
    <div className="login-panel">
      <p>(Artificial Mind) - Web Client</p>
      <div className="buttons">
        <button onClick={button.refresh}>Refresh</button>
        <button onClick={button.save}>Save</button>
        <button onClick={button.add}>Add</button>
        <button onClick={button.remove}>Remove</button>
      </div>
      <div className="select_data">
        <Select
          styles={{
            // Fixes the overlapping problem of the component
            menu: provided => ({ ...provided, zIndex: 9999 })
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
      {hook_select_current_value !== "" &&
        Object.keys(hook_select_current_value).length > 0 && (
          <div className="edit_data">
            <Form
              schema={form_schema.json}
              uiSchema={form_schema.ui}
              onChange={form_data_changed}
              formData={state_current_login_data}
            >
              <br />
            </Form>
          </div>
        )}

      {state_draft_mode !== true &&
      hook_select_current_value !== "" &&
      state_error === "" &&
      hook_select_current_value !== "" &&
      Object.keys(hook_select_current_value).length > 0 ? (
        <button className="big-button" onClick={button.login}>
          Login
        </button>
      ) : (
        <div>
          {hook_select_current_value === "" && (
            <div className="error-text">Not selected option</div>
          )}
          {state_error !== "" && (
            <div className="error-text">{state_error}</div>
          )}
          {state_draft_mode === true && (
            <div className="error-text">Save to leave draft mode</div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginPanel;