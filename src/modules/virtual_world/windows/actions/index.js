import React from "react";
import Table from "rc-table";
import Select from "react-select";
import useSelectHook from "../../../../hooks/select_hook";
import { ProtocolContext } from "../../../../context/protocol";
import Util from "../../../../framework/util";

import "./index.css";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 100
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 100
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: 100
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 200
  }
];

const PACKET_NAME = "data_mirror";

function Actions(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const {
    hook_select_current_value,
    hook_select_options,
    hook_select_selected_option,
    hook_select_fn
  } = useSelectHook({
    default_value: "",
    create_label: (object) => {
      return object.id;
    }
  });

  const [state_current_object, set_state_current_object] = React.useState("");
  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_data, set_state_data] = React.useState([]);

  const parse_packet = () => {
    const packets = context_packets_fn.peek(PACKET_NAME);
    if (packets.length === 0) return;

    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());

    const select_objects = [];
    for (const id of Object.keys(packet.mirror.objects))
      select_objects.push({
        id
      });

    let current_object = null;
    for (const object of select_objects)
      if (object.id === state_current_object.id) current_object = object;

    hook_select_fn.update(select_objects, current_object);
  };

  React.useEffect(() => {
    if (state_current_object == null || state_current_object.id == null) return;

    const data = [];
    for (let i = 0; i < 10; i++)
      data.push({
        date: new Date().toISOString(),
        name: i + "_" + state_current_object.id,
        age: 36 + "_" + state_current_object.id,
        address: "some where" + "_" + state_current_object.id,
        key: i + "_" + state_current_object.id
      });
    set_state_data(data);
  }, [state_current_object]);

  React.useEffect(() => parse_packet(), [context_packets_data]);
  React.useEffect(() => set_state_current_object(hook_select_current_value), [
    hook_select_current_value
  ]);

  return (
    <React.Fragment>
      <div className="bar">
        <label>{`Last sync: ${state_last_sync}`}</label>
      </div>
      <Select
        styles={{
          // Fixes the overlapping problem of the component
          menu: (provided) => ({ ...provided, zIndex: 9999 })
        }}
        value={hook_select_selected_option}
        placeholder={`Select object... [${
          Object.keys(hook_select_options).length
        }]`}
        onChange={hook_select_fn.on_change}
        options={hook_select_options}
        isClearable={true}
      />
      <Table columns={columns} data={state_data} />
    </React.Fragment>
  );
}

export default Actions;
