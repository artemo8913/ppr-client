import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import apiFetch from "../../healper/ApiFetch";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

import CreatePpr from "./CreatePpr";
import { IPprGeneralData } from "../../Interface";
import { Box } from "@mui/material";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "year", headerName: "Год", width: 90 },
  { field: "dir_name_short", headerName: "Дирекция", width: 90 },
  { field: "dis_name_short", headerName: "Дистанция", width: 90 },
  { field: "sub_name_short", headerName: "Подразделение", width: 130 },
  { field: "status", headerName: "Статус", width: 120 },
  { field: "month", headerName: "Месяц заполнения", width: 150 },
];

const years = ["2021", "2022", "2023"];

export default function AllPprTable() {
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store.user);
  const [allPpr, setAllPpr] = React.useState<{ data: Array<IPprGeneralData> }>({ data: [] });
  const [dataForCreatingNewPpr, setData] = React.useState({ prototypePlanId: "", year: "" });

  function dataSelect(type: string, value: string) {
    setData((prev) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  }
  const dataForCreating = {
    prototypePlanId: dataForCreatingNewPpr?.prototypePlanId,
    year: dataForCreatingNewPpr?.year,
    id_subdivision: user.id_subdivision,
    id_distance: user.id_distance,
    id_direction: user.id_direction,
    status: "creating",
    month: 'year'
  };
  React.useEffect(() => {
    apiFetch.exchangeData("http://localhost:5000/api/ppr", "parse", setAllPpr, "get");
  }, []);
  async function createNewPpr() {
    await apiFetch.exchangeData("http://localhost:5000/api/ppr", "stringify", console.log, "post", dataForCreating);
    await apiFetch.exchangeData("http://localhost:5000/api/ppr", "parse", setAllPpr, "get");
  }

  return (
    <Fragment>
      <Box sx={{ height: 300, width: "100%" }}>
        <DataGrid density="compact" rows={allPpr.data} columns={columns} onRowClick={({ id }) => navigate(`/ppr/${id}`)} />
      </Box>
      <Box sx={{ p: 2, display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <CreatePpr
          handleClick={async () => await createNewPpr()}
          dataForCreatingNewPpr={dataForCreatingNewPpr}
          dataSelect={dataSelect}
          yearList={years}
          pprPrototypesList={allPpr.data}
        />
      </Box>
    </Fragment>
  );
}
