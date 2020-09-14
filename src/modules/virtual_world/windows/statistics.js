import React from "react";
import _ from "lodash";
import { ObjectInspector, ObjectLabel } from "react-inspector";
import Creatable from "react-select/creatable";
import useSelectHook from "../../../hooks/select_hook";
import { ProtocolContext } from "../../../context/protocol";
import Util from "../../../framework/util";

const PACKET_NAME = "data_mirror";
const INITIAL_HIDDEN_PROPERTIES = ["aml", "world"];
const react_inspector_node_renderer = (args) => {
  const { depth, name, data, isNonenumerable, expanded } = args;
  if (depth === 0) return <label>Statistics</label>;
  else if (depth === 1) return <label>{name}</label>;
  else {
    return (
      <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />
    );
  }
};
const react_select_custom_styles = {
  menu: (provided, state) => {
    return { ...provided, zIndex: 9999 };
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const new_style = { ...styles };
    if (data.color != null) new_style.color = data.color;
    return new_style;
  }
};

function Statistic(props) {
  const { context_packets_data, context_packets_fn } = React.useContext(
    ProtocolContext
  );

  const [state_hidden_properties, set_state_hidden_properties] = React.useState(
    INITIAL_HIDDEN_PROPERTIES
  );
  const [state_all_properties, set_state_all_properties] = React.useState([]);

  const [state_data, set_state_data] = React.useState({});
  const [state_show_data, set_state_show_data] = React.useState({});

  const [state_last_sync, set_state_last_sync] = React.useState("");

  const {
    hook_select_new_created,
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

  const parse_packet = () => {
    const packets = context_packets_fn.peek(PACKET_NAME);
    if (packets.length === 0) return;

    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());

    const data = {};
    for (const [name, object] of Object.entries(packet.mirror.objects)) {
      const object_data = {};
      for (const [key, value] of Object.entries(object.data))
        if (key !== "queue") object_data[key] = value;
      if (Object.keys(object_data).length > 0) data[name] = object_data;
    }

    set_state_data(data);
  };

  const properties_fn = {
    add_hidden(value) {
      if (value == null || state_hidden_properties.includes(value)) return;
      set_state_hidden_properties([...state_hidden_properties, value]);
    },
    remove_hidden(value) {
      if (value == null || !state_hidden_properties.includes(value)) return;
      set_state_hidden_properties(
        state_hidden_properties.filter((e) => e !== value)
      );
    },
    toggle(value) {
      if (value == null) return;
      if (state_hidden_properties.includes(value)) {
        this.remove_hidden(value);
      } else {
        this.add_hidden(value);
      }
    },
    update() {
      const properties = [...state_hidden_properties];
      for (const object of Object.values(state_data)) {
        for (const property of Object.keys(object))
          if (!properties.includes(property)) properties.push(property);
      }

      set_state_all_properties(properties);
    }
  };

  const update_show_data = () => {
    const show_data = _.cloneDeep(state_data);
    for (const [object_key, object_value] of Object.entries(show_data)) {
      for (const property_key of Object.keys(object_value))
        if (state_hidden_properties.includes(property_key))
          delete show_data[object_key][property_key];
    }

    set_state_show_data(show_data);
  };

  const update_select_list = () => {
    const select_objects = [];

    for (const property of state_all_properties) {
      if (state_hidden_properties.includes(property))
        select_objects.push({
          id: `[+] ${property}`,
          name: property,
          type: "remove",
          _color: "red"
        });
      else
        select_objects.push({
          id: `[-] ${property}`,
          name: property,
          type: "add",
          _color: "green"
        });
    }

    hook_select_fn.update(select_objects, null);
  };

  React.useEffect(() => {
    update_select_list();
    update_show_data();
  }, [state_all_properties, state_hidden_properties]);
  React.useEffect(() => properties_fn.update(), [state_data]);
  React.useEffect(() => parse_packet(), [context_packets_data]);
  React.useEffect(() => {
    properties_fn.toggle(hook_select_current_value.name);
  }, [hook_select_current_value]);
  React.useEffect(
    () => properties_fn.add_hidden(hook_select_new_created.value),
    [hook_select_new_created]
  );

  return (
    <div className="content_body">
      <div className="bar">
        <label>{`Last sync: ${state_last_sync}`}</label>
      </div>
      <Creatable
        styles={react_select_custom_styles}
        value={hook_select_selected_option}
        placeholder={`Select to show/hide or enter to add prop. [${
          Object.keys(hook_select_options).length
        }]`}
        onChange={hook_select_fn.on_change}
        options={hook_select_options.sort((a, b) =>
          a.value.id.localeCompare(b.value.id)
        )}
        isClearable={true}
        maxMenuHeight={150}
      />
      <ObjectInspector
        expandLevel={10}
        theme="chromeDark"
        data={state_show_data}
        nodeRenderer={react_inspector_node_renderer}
      />
    </div>
  );
}

export default Statistic;
