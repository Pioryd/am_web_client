import React from "react";
import Row from "./row";
import { AppContext } from "../../../../../context/app";
import "./index.css";

function EditData(props) {
  const {
    context_admin,
    context_data_full,
    context_data_character,
    context_data_world,
    context_change_position,
    context_change_land,
    context_add_friend,
    context_remove_friend,
    context_change_state,
    context_change_action,
    context_change_activity
  } = React.useContext(AppContext);

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        <div className="edit-form">
          <Row
            key="change_position"
            row_key="position"
            on_process={value => {
              context_change_position({ position_x: value });
            }}
          />
          <Row
            key="change_land"
            row_key="land id"
            on_process={value => {
              context_change_land({ land_id: value });
            }}
          />
          <Row
            key="add_friend"
            row_key="add friend"
            on_process={value => {
              context_add_friend({ name: value });
            }}
          />
          <Row
            key="remove_friend"
            row_key="remove friend"
            on_process={value => {
              context_remove_friend({ name: value });
            }}
          />
          <Row
            key="change_state"
            row_key="change state"
            on_process={value => {
              context_change_state({ name: value });
            }}
          />
          <Row
            key="change_action"
            row_key="change action"
            on_process={value => {
              context_change_action({ name: value });
            }}
          />
          <Row
            key="change_activity"
            row_key="change activity"
            on_process={value => {
              context_change_activity({ name: value });
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default EditData;
