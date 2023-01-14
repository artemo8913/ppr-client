import React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import apiFetch from "../../healper/ApiFetch";

/**
 * { "id": 3, "year": "2021", "id_subdivision": 1, "id_distance": 1,
 * "id_direction": 1, "status": "1234", "name": "pprechk9",
 * "dir_name": "Красноярская дирекция по энергообеспечению", "dis_name": "Красноярская дистанция электроснабжения",
 * "sub_name": "Район контактной сети ЭЧК-9",
 * "dir_name_short": "КрасНТЭ", "dis_name_short": "ЭЧ-3", "sub_name_short": "ЭЧК-9" }
 */

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "year", headerName: "Год", width: 90 },
  { field: "dir_name_short", headerName: "Дирекция", width: 90 },
  { field: "dis_name_short", headerName: "Дистанция", width: 90 },
  { field: "sub_name_short", headerName: "Подразделение", width: 130 },
  { field: "status", headerName: "Статус", width: 90 },
];

export default function AllPprTable() {
  const [allPpr, setallPpr] = React.useState({ data: [] });
  React.useEffect(() => {
    apiFetch.getData("http://localhost:5000/api/ppr", "parse", setallPpr, "get");
  }, []);
  return (
    <div style={{backgroundColor:"white", height: 300, width: "100%" }}>
      <DataGrid density="compact" rows={allPpr.data} columns={columns} pageSize={5} onRowClick={({id})=>console.log('clivk',id)} />
    </div>
  );
}
