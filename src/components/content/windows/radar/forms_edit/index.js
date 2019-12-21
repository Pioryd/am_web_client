import React from "react";
import Row from "./row";
import { AppContext } from "../../../../context/app";
import { GuiContext } from "../../../../context/gui";
import "./index.css";

function FormsEdit(props) {
  const {
    context_source,
    context_on_edit_form,
    context_on_remove_form,
    context_log
  } = React.useContext(AppContext);

  const { context_clicked_point_name } = React.useContext(GuiContext);

  const [state_source, set_state_source] = React.useState();
  const [state_current_form, set_state_current_form] = React.useState({});
  const [state_search_value, set_state_search_value] = React.useState("");
  const [state_content, set_state_content] = React.useState("");

  const set_not_found_ = name => {
    set_state_content(<p>{`Not found: "${state_search_value}"`}</p>);
    if (name == null) name = "";
    set_state_search_value(name);
  };

  const search_and_set_table_by_name = value => {
    if (state_source == null) return;

    for (let i = 0; i < state_source.length; i++) {
      if (state_source[i].name === value) {
        let current_form = { ...state_source[i] };
        set_state_current_form(current_form);
        return;
      }
    }
    set_not_found_(value);
  };

  const search_and_set_table_by_step = step_name => {
    if (state_source == null) return;

    let current_form = { ...state_current_form };

    if (
      Object.entries(current_form).length === 0 &&
      current_form.constructor === Object
    ) {
      if (state_source.length < 2) return;
      current_form = { ...state_source[1] };
    }

    let i = 0;
    if (step_name === "prev") {
      i = state_source.length;
      while (i--)
        if (state_source[i].name === current_form.name) {
          i--;
          break;
        }

      if (i < 0) i = state_source.length - 1;
    } else {
      i = 0;
      for (; i < state_source.length; i++)
        if (state_source[i].name === current_form.name) {
          i++;
          break;
        }

      if (i >= state_source.length) i = 0;
    }

    set_state_current_form({ ...state_source[i] });
  };

  const set_empty_current_form = () => {
    if (state_source == null) return;

    if (
      (Object.entries(state_source).length === 0 &&
        state_source.constructor === Object) ||
      state_source.length < 2
    ) {
      set_state_content(
        "<p>Error: To create new form, source must contains at least 2 points.</p>"
      );
      return;
    }

    let current_form = { ...state_source[1] };

    for (const [key, value] of Object.entries(current_form))
      current_form[key] = "";

    set_state_current_form(current_form);
  };

  const save_form = () => {
    if (window.confirm("Are toy sure to SAVE this form?")) {
      context_on_edit_form({ ...state_current_form });
      set_state_content(
        <React.Fragment>
          <p>Saving changes...</p>
          <p>Click refresh to back.</p>
        </React.Fragment>
      );
    }
  };

  const remove_form = () => {
    if (window.confirm("Are toy sure to REMOVE this form?")) {
      context_on_remove_form(state_current_form);
      set_state_content(
        <React.Fragment>
          <p>REMOVING form...</p>
          <p>Click refresh to back.</p>
        </React.Fragment>
      );
    }
  };

  React.useEffect(() => {
    set_not_found_("");
  }, []);

  React.useEffect(() => {
    if (context_log !== "") set_state_content(context_log);
  }, [context_log]);

  React.useEffect(() => {
    search_and_set_table_by_name(context_clicked_point_name);
  }, [context_clicked_point_name]);

  React.useEffect(() => {
    const add_table = current_form => {
      const on_value_change = (key, value) => {
        let current_form = { ...state_current_form };
        if (!(key in current_form)) return;

        current_form[key] = value;

        set_state_current_form(current_form);
      };

      const fields = [];
      for (const [key, value] of Object.entries(current_form))
        fields.push(
          <Row
            key={key}
            row_key={key}
            row_value={value}
            on_value_change={on_value_change}
          />
        );

      set_state_content(fields);
    };
    if (context_source != null && "points" in context_source)
      set_state_source(context_source.points);

    if ("name" in state_current_form) add_table(state_current_form);
  }, [context_source, state_current_form]);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar">
          <input
            type="text"
            onChange={e => {
              search_and_set_table_by_name(e.target.value);
            }}
          ></input>
          <button
            onClick={e => {
              search_and_set_table_by_name(e.target.value);
            }}
          >
            {"find by name"}
          </button>
          <button
            onClick={e => {
              search_and_set_table_by_step("prev");
            }}
          >
            {"prev"}
          </button>
          <button
            onClick={e => {
              search_and_set_table_by_step("next");
            }}
          >
            {"next"}
          </button>
          <button
            onClick={e => {
              search_and_set_table_by_name(state_current_form.name);
            }}
          >
            {"refresh"}
          </button>
          <button
            onClick={() => {
              set_empty_current_form();
            }}
          >
            {"new"}
          </button>
          <button
            onClick={() => {
              save_form();
            }}
          >
            {"save"}
          </button>
          <button
            onClick={e => {
              remove_form();
            }}
          >
            {"remove"}
          </button>
        </div>
        <div className="radar-edit-form">{state_content}</div>
      </div>
    </React.Fragment>
  );
}

export default FormsEdit;
