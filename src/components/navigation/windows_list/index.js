import React from "react";
import ButtonsList from "./buttons_list";
import useDropdownListHook from "./dropdown_list_hook";

function WindowsList(props) {
  const hook_dropdown_list = useDropdownListHook({ enabled: false });
  return (
    <React.Fragment>
      <div className="dropdown-list" {...hook_dropdown_list.attr}>
        <ButtonsList />
      </div>
      <div
        className="dropbtn"
        onClick={e => {
          e.preventDefault();
          hook_dropdown_list.toggle();
        }}
      >
        Windows manager
      </div>
    </React.Fragment>
  );
}

export default WindowsList;
