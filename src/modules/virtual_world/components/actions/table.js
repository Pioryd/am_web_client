import React from "react";
import { useTable } from "react-table";
import { ObjectInspector, ObjectLabel } from "react-inspector";

const react_inspector_node_renderer = (args) => {
  const { depth, name, data, isNonenumerable, expanded } = args;
  if (depth === 0) {
    return <label>Data</label>;
  } else {
    return (
      <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />
    );
  }
};

function Table(props) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Info",
        accessor: "info"
      },
      {
        Header: "Data",
        accessor: "data"
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data: props.data });

  return (
    <table {...getTableProps()} style={{ border: "solid 1px white" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  border: "solid 1px white",
                  borderBottom: "solid 3px white",
                  background: "black",
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: cell.column.Header === "Data" ? "0px" : "2px",
                      border: "solid 1px white",
                      background: "black",
                      color: "white"
                    }}
                  >
                    {(() => {
                      const value =
                        cell.row.values[cell.column.Header.toLowerCase()];
                      switch (cell.column.Header) {
                        case "Data":
                          return (
                            <ObjectInspector
                              expandLevel={10}
                              theme="chromeDark"
                              data={value}
                              nodeRenderer={react_inspector_node_renderer}
                            />
                          );
                        case "Info":
                          return (
                            <div className="Y6z_table-column-info">
                              <p className="Y6z_time">{value.time}</p>
                              <p className="Y6z_area">{value.area}</p>
                              <p className="Y6z_object">{value.object_id}</p>
                              <p className="Y6z_api">{value.api}</p>
                            </div>
                          );
                        default:
                          return <div>{cell.render("Cell")}</div>;
                      }
                    })()}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
