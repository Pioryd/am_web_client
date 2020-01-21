import React from "react";
import ButtonsList from "./buttons_list";
import useDropdownListHook from "./dropdown_list_hook";
import "./index.css";

function WindowsList(props) {
  const hook_dropdown_list = useDropdownListHook({ enabled: false });
  return (
    <React.Fragment>
      <button
        onClick={e => {
          e.preventDefault();
          hook_dropdown_list.toggle();
        }}
      >
        Windows manager
      </button>
      <div className="dropdown-buttons-list" {...hook_dropdown_list.attr}>
        <ButtonsList />
      </div>
    </React.Fragment>
  );
}

export default WindowsList;
