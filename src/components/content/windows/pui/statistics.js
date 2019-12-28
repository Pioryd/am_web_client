import React from "react";
import { JsonTree } from "react-editable-json-tree";
import { AppContext } from "../../../../context/app";

function Statistics() {
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

  const on_edit = ({ type, keyPath, deep, key, newValue, oldValue }) => {
    if (context_admin === true) return;

    console.log({
      type,
      keyPath,
      deep,
      key,
      newValue,
      oldValue
    });

    if (
      type === "UPDATE_DELTA_TYPE" &&
      key === "x" &&
      keyPath.length === 2 &&
      keyPath[0] === "character" &&
      keyPath[1] === "position"
    ) {
      if (newValue !== oldValue)
        context_change_position({ position_x: newValue });
    } else if (
      type === "UPDATE_DELTA_TYPE" &&
      key === "land_id" &&
      keyPath.length === 2 &&
      keyPath[0] === "character" &&
      keyPath[1] === "position"
    ) {
      if (newValue !== oldValue) context_change_land({ land_id: newValue });
    } else if (
      type === "ADD_DELTA_TYPE" &&
      keyPath.length === 2 &&
      keyPath[0] === "character" &&
      keyPath[1] === "friends_list"
    ) {
      if (oldValue == null && newValue != null)
        context_add_friend({ name: newValue });
    } else if (
      type === "REMOVE_DELTA_TYPE" &&
      keyPath.length === 2 &&
      keyPath[0] === "character" &&
      keyPath[1] === "friends_list"
    ) {
      if (oldValue != null && newValue == null)
        context_remove_friend({ name: oldValue });
    } else if (
      type === "UPDATE_DELTA_TYPE" &&
      key === "state" &&
      keyPath.length === 1 &&
      keyPath[0] === "character"
    ) {
      if (newValue !== oldValue) context_change_state({ name: newValue });
    } else if (
      type === "UPDATE_DELTA_TYPE" &&
      key === "action" &&
      keyPath.length === 1 &&
      keyPath[0] === "character"
    ) {
      if (newValue !== oldValue) context_change_action({ name: newValue });
    } else if (
      type === "UPDATE_DELTA_TYPE" &&
      key === "activity" &&
      keyPath.length === 1 &&
      keyPath[0] === "character"
    ) {
      if (newValue !== oldValue) context_change_activity({ name: newValue });
    }
  };

  return (
    <React.Fragment>
      <div className="content_body">
        <div className="bar"></div>
        {context_admin ? (
          <React.Fragment>
            <JsonTree
              rootName="context_data_full"
              data={context_data_full}
              isCollapsed={() => {
                return false;
              }}
              cancelButtonElement={<button>Cancel</button>}
              editButtonElement={<button>Accept</button>}
              addButtonElement={<button>Add</button>}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <JsonTree
              rootName="context_data_character"
              data={context_data_character}
              onDeltaUpdate={on_edit}
              isCollapsed={() => {
                return false;
              }}
              cancelButtonElement={<button>Cancel</button>}
              editButtonElement={<button>Accept</button>}
              addButtonElement={<button>Add</button>}
            />
            <JsonTree
              rootName="context_data_world"
              data={context_data_world}
              isCollapsed={() => {
                return false;
              }}
              cancelButtonElement={<button>Cancel</button>}
              editButtonElement={<button>Accept</button>}
              addButtonElement={<button>Add</button>}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

export default Statistics;
