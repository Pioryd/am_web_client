import React from "react";

import AceEditor from "react-ace";
import _ from "lodash";
import Select from "react-select";
import Diagram from "beautiful-react-diagrams";
import useSelectHook from "../../../../hooks/select_hook";
import { ProtocolContext } from "../../../../context/protocol";
import Util from "../../../../framework/util";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

import "beautiful-react-diagrams/styles.css";

require("./index.css");

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

function diagram_custom_render(props) {
  const render_port = (port) => {
    return React.cloneElement(
      port,
      {
        style: {
          display: "block",
          borderRadius: "10px",
          color: "#000000",
          marginTop: "5px",
          background: "#ffffff",
          height: "40px"
        }
      },
      <div>
        <p className="name">{port.props.name}</p>
      </div>
    );
  };

  const { inputs, outputs, content } = props;

  return (
    <div key={`${content}_top_class`} className="visual_module">
      <p className="name">{content}</p>
      <div className="visual_ports">
        {inputs.map((port) => render_port(port))}
        {outputs.map((port) => render_port(port))}
      </div>
    </div>
  );
}

function get_diagram_port_id(module_name, socket_name) {
  return module_name + "_" + socket_name;
}

const VisualConnections = () => {
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
    create_label: (object) => object.id
  });

  const [state_error, set_state_error] = React.useState("");
  const [state_mode, set_state_mode] = React.useState("visual");
  const [state_last_sync, set_state_last_sync] = React.useState("");
  const [state_schema, set_state_schema] = React.useState({
    nodes: [],
    links: []
  });
  const [state_source, set_state_source] = React.useState({});
  const [state_modules_sockets, set_state_modules_sockets] = React.useState({});

  const update_schema = ({
    modules_to_add = [],
    modules_to_remove = [],
    connections_to_add = [],
    connections_to_remove = []
  }) => {
    const add_module = (schema, module_name) => {
      if (state_modules_sockets[module_name] == null) return;
      for (const node of schema.nodes) if (node.id === module_name) return;

      const last_coordinates = [0, 0];
      let coordinates = null;

      while (true) {
        let found = false;
        for (const node of schema.nodes) {
          if (
            node.coordinates[0] === last_coordinates[0] &&
            node.coordinates[1] === last_coordinates[1]
          ) {
            found = true;
            break;
          }
        }

        if (!found) {
          coordinates = last_coordinates;
          break;
        } else {
          last_coordinates[1] += 50;
        }
      }

      let outputs = [];
      for (const socket_name of state_modules_sockets[module_name]) {
        outputs.push({
          id: get_diagram_port_id(module_name, socket_name),
          name: socket_name,
          alignment: "right"
        });
      }

      schema.nodes.push({
        id: module_name,
        content: module_name,
        coordinates,
        outputs,
        data: {},
        render: diagram_custom_render
      });
    };
    const remove_module = (schema, module_name) => {
      schema.nodes = schema.nodes.filter((item) => item.id !== module_name);
      schema.links = schema.links.filter(
        (item) =>
          item.output.substring(0, module_name.length) !== module_name &&
          item.input.substring(0, module_name.length) !== module_name
      );
    };
    const add_connection = (schema, connection) => {
      schema.links.push({
        input: get_diagram_port_id(connection.in.module, connection.in.port),
        output: get_diagram_port_id(connection.out.module, connection.out.port)
      });
    };
    const remove_connection = (schema, connection) => {
      schema.links = schema.links.filter(
        (item) =>
          item.input !==
            get_diagram_port_id(connection.in.module, connection.in.port) &&
          item.output !==
            get_diagram_port_id(connection.out.module, connection.out.port)
      );
    };

    const schema = {
      nodes: [...state_schema.nodes],
      links: [...state_schema.links]
    };

    for (const module_name of modules_to_add) add_module(schema, module_name);
    for (const module_name of modules_to_remove)
      remove_module(schema, module_name);
    for (const connection of connections_to_add)
      add_connection(schema, connection);
    for (const connection of connections_to_remove)
      remove_connection(schema, connection);

    set_state_schema(schema);
  };

  const switch_to_source = () => {
    const source_object = {};
    const get_connection_data = (link, nodes) => {
      let data = {};
      let from_module = null;
      let from_socket = null;

      for (const node of nodes) {
        for (const node_output of node.outputs) {
          if (node_output.id === link.input) {
            from_module = node.id;
            from_socket = node_output.name;
            data[from_module] = {};
            data[node.id][node_output.name] = {};
          }
        }
      }

      if (
        Object.keys(data).length === 0 ||
        from_module == null ||
        from_socket == null
      ) {
        return data;
      }
      for (const node of nodes) {
        for (const node_output of node.outputs) {
          if (node_output.id === link.output) {
            const to_module = node.id;
            const to_socket = node_output.name;

            data[from_module][from_socket] = {};
            data[from_module][from_socket][to_module] = to_socket;
          }
        }
      }

      return data;
    };

    const schema = { ...state_schema };
    for (const link of schema.links)
      _.merge(source_object, get_connection_data(link, schema.nodes));

    set_state_source(JSON.stringify(source_object, null, 2));
    set_state_schema({ nodes: [], links: [] });

    set_state_mode("source");
  };

  const switch_to_visual = () => {
    try {
      const object = JSON.parse(state_source);
      const modules_to_add = [];
      const connections_to_add = [];

      for (const [from_module, from_sockets] of Object.entries(object)) {
        modules_to_add.push(from_module);
        for (const [from_socket, to_modules] of Object.entries(from_sockets)) {
          for (const [to_module, to_socket] of Object.entries(to_modules)) {
            modules_to_add.push(to_module);
            connections_to_add.push({
              in: { module: from_module, port: from_socket },
              out: { module: to_module, port: to_socket }
            });
          }
        }
      }

      update_schema({ modules_to_add, connections_to_add });
      set_state_mode("visual");
    } catch (e) {
      set_state_error(`Unable to switch to visual mode. ${e.message}`);
    }
  };

  const refresh = () => context_packets_fn.send("visual_data");

  const update_select_list = () => {
    const select_objects = [];
    const schema = { ...state_schema };
    const modules_sockets = { ...state_modules_sockets };

    for (const module_name of Object.keys(modules_sockets)) {
      let found = false;
      for (const node of schema.nodes) {
        if (node.id === module_name) {
          found = true;
          break;
        }
      }
      if (found)
        select_objects.push({
          id: `[REMOVE] ${module_name}`,
          name: module_name,
          type: "remove",
          _color: "red"
        });
      else
        select_objects.push({
          id: `[ADD] ${module_name}`,
          name: module_name,
          type: "add",
          _color: "green"
        });
    }

    hook_select_fn.update(select_objects, null);
  };

  const parse_packet = () => {
    const packets = context_packets_fn.peek("visual_data");
    if (packets.length === 0) return;

    const packet = packets.pop();
    set_state_last_sync(Util.get_time_hms());

    if (packet.modules_sockets === null) return;

    set_state_modules_sockets(packet.modules_sockets);
  };

  const handle_select_current_value = (select_current_value) => {
    const { id, type, name } = select_current_value;
    if (id == null) return;
    update_schema({
      modules_to_add: type === "add" ? [name] : [],
      modules_to_remove: type === "remove" ? [name] : []
    });
  };

  React.useEffect(() => parse_packet(), [context_packets_data]);
  React.useEffect(() => update_select_list(), [
    state_modules_sockets,
    state_schema
  ]);
  React.useEffect(() => {
    handle_select_current_value(hook_select_current_value);
  }, [hook_select_current_value]);

  return (
    <div className="connections_area">
      <div className="bar">
        <div className="bar_area">
          <button
            key="switch_to_source_or_visual"
            className="button"
            onClick={() => {
              state_mode === "visual" ? switch_to_source() : switch_to_visual();
            }}
          >
            {state_mode === "visual" ? "Switch to source" : "Switch to visual"}
          </button>
          <label>Last sync: {state_last_sync}</label>
          <button key="refresh_source" className="button" onClick={refresh}>
            refresh
          </button>
          <div className="select_area">
            <Select
              styles={react_select_custom_styles}
              value={hook_select_selected_option}
              placeholder={`Select to add/remove module [${
                Object.keys(hook_select_options).length
              }]`}
              onChange={hook_select_fn.on_change}
              options={hook_select_options.sort((a, b) =>
                a.value.id.localeCompare(b.value.id)
              )}
              isClearable={true}
              maxMenuHeight={150}
            />
          </div>
        </div>
      </div>
      {state_error !== "" && (
        <div className="error_box">
          <p className="text">{state_error}</p>
          <button onClick={() => set_state_error("")}>OK</button>
        </div>
      )}
      {state_mode === "visual" ? (
        <Diagram schema={state_schema} onChange={set_state_schema} />
      ) : (
        <AceEditor
          width="100%"
          height="100%"
          mode="json"
          theme="monokai"
          name="editor_name"
          onChange={set_state_source}
          value={state_source}
        />
      )}
    </div>
  );
};

export default VisualConnections;
