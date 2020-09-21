import React from "react";
import Form from "react-jsonschema-form";
import Select from "react-select";
import useSelectHook from "../../../hooks/select_hook";
import Util from "../../../framework/util";
import form_schema from "./form_schema";
import { AppContext } from "../../../context/app";

import "./index.css";

function LoginPanel(props) {
  const { context_app_data, context_app_fn } = React.useContext(AppContext);

  const {
    hook_select_current_value,
    hook_select_options,
    hook_select_selected_option,
    hook_select_fn
  } = useSelectHook({
    default_value: "",
    create_label: (object) => object.id
  });

  const [state_draft_mode, set_state_draft_mode] = React.useState(false);
  const [state_error, __set_state_error] = React.useState("");
  const [state_login_data_map, set_state_login_data_map] = React.useState(null);
  const [
    state_current_login_data,
    set_state_current_login_data
  ] = React.useState(null);

  const set_error = (message) =>
    __set_state_error(
      message === "" ? "" : `[${Util.get_time_hms(new Date())}] ${message}`
    );

  const parse_to = (type, data) => {
    try {
      if (data == null || Object.keys(data).length === 0)
        throw new Error(`No data.`);

      for (const [key, value] of Object.entries(data)) {
        if (!["connection_accept_data", "settings"].includes(key)) continue;
        if (type === "raw") data[key] = JSON.parse(value);
        if (type === "string") data[key] = JSON.stringify(value, null, 2);
      }
    } catch (e) {
      console.log({ data });
      set_error(`Unable to format json[${data.id}].` + ` Error ${e.message}`);
    }

    return data;
  };

  const form_data_changed = ({ formData }) => {
    set_state_draft_mode(true);
    set_state_current_login_data({ ...state_current_login_data, ...formData });
  };

  const button = {
    refresh: () => {
      try {
        const login_panel_data = context_app_data.login_panel || {};
        const login_data_map = {};
        for (const [key, value] of Object.entries(login_panel_data))
          login_data_map[key] = parse_to("string", value);

        set_state_login_data_map(login_data_map);
      } catch (e) {
        set_error(`Unable to refresh. ${e.message}`);
      }
    },
    save: () => {
      try {
        set_error("");
        const login_data_map = { ...state_login_data_map };

        if (hook_select_selected_option.value == null)
          throw new Error("No option is selected.");

        if (
          hook_select_selected_option.value.id !== state_current_login_data.id
        )
          delete login_data_map[hook_select_selected_option.value.id];

        if (hook_select_selected_option !== "")
          login_data_map[
            state_current_login_data.id
          ] = state_current_login_data;
        set_state_login_data_map(login_data_map);
        set_state_draft_mode(false);
      } catch (e) {
        set_error(`Unable to save. ${e.message}`);
      }
    },
    add: () => {
      try {
        const login_data_map = { ...state_login_data_map };
        let login_data = {
          id: new Date().getTime(),
          module: "admin",
          connection_accept_data: { login: "", password: "" },
          host: "localhost",
          port: 0,
          settings: { client_timeout: 0 },
          description: "",
          session_id: "session_" + new Date().getTime()
        };

        login_data_map[login_data.id] = parse_to("string", login_data);
        set_state_login_data_map(login_data_map);
      } catch (e) {
        set_error(`Unable to add. ${e.message}`);
      }
    },
    remove: () => {
      try {
        if (state_current_login_data === null) return;

        const login_data_map = { ...state_login_data_map };
        delete login_data_map[state_current_login_data.id];

        set_state_login_data_map(login_data_map);
      } catch (e) {
        set_error(`Unable to remove. ${e.message}`);
      }
    },
    login: () => {
      try {
        const login_data = {
          ...state_current_login_data,
          connection: {
            accept_data: JSON.parse(
              state_current_login_data.connection_accept_data
            )
          },
          settings: JSON.parse(state_current_login_data.settings)
        };
        context_app_fn.update_session(
          { _settings: login_data },
          login_data.session_id
        );
      } catch (e) {
        set_error(`Unable to login. ${e.message}`);
      }
    }
  };

  React.useEffect(() => {
    // When new [state_login_data_map]
    // Update [select] [current_login_data] "session_data"
    if (state_login_data_map == null) return;

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

    const login_data_map = Util.shallow_copy(state_login_data_map);
    for (const [key, data] of Object.entries(login_data_map))
      login_data_map[key] = parse_to("raw", data);

    context_app_fn.update_data({ login_panel: login_data_map });
  }, [state_login_data_map]);

  React.useEffect(
    () => set_state_current_login_data(hook_select_current_value),
    [hook_select_current_value]
  );

  // Don't know how to do this better.
  const [state_first_loaded, set_state_first_loaded] = React.useState(false);
  React.useEffect(() => {
    if (
      state_first_loaded ||
      context_app_data.login_panel == null ||
      Object.keys(context_app_data.login_panel).length === 0
    )
      return;
    button.refresh();
    set_state_first_loaded(true);
  }, [context_app_data]);

  return (
    <React.Fragment>
      <div className="buttons">
        <button onClick={button.refresh}>Refresh</button>
        <button onClick={button.save}>Save</button>
        <button onClick={button.add}>New</button>
        <button onClick={button.remove}>Remove</button>
      </div>
      <div className="select_data">
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
            <div className="error-text">No selected option</div>
          )}
          {state_error !== "" && (
            <div className="error-text">{state_error}</div>
          )}
          {state_draft_mode === true && (
            <div className="error-text">Save to leave draft mode</div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default LoginPanel;
