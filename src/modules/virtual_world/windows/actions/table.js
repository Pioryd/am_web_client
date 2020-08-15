import React from "react";
import { useTable } from "react-table";
import JSONPretty from "react-json-pretty";
const theme_monikai = require("react-json-pretty/dist/monikai");

function Table(props) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Time",
        accessor: "time"
      },
      {
        Header: "Area",
        accessor: "area"
      },
      {
        Header: "Object_ID",
        accessor: "object_id"
      },
      {
        Header: "API",
        accessor: "api"
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
                      padding: cell.column.Header === "Data" ? "0px" : "10px",
                      border: "solid 1px white",
                      background: "black",
                      color: "white"
                    }}
                  >
                    {cell.column.Header === "Data" ? (
                      <JSONPretty
                        id="json-pretty"
                        theme={{
                          ...theme_monikai,
                          main:
                            "line-height:1.3;color:#66d9ef;background:#000;overflow:auto;"
                        }}
                        data={cell.row.values.data}
                      ></JSONPretty>
                    ) : (
                      <div>{cell.render("Cell")}</div>
                    )}
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
