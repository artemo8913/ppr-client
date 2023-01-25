import React, { Fragment } from "react";
import { Button, Select, MenuItem, FormControl, InputLabel, FormLabel } from "@mui/material";
import { IPprGeneralData } from "../../Interface";

export default function CreatePpr(props: {
  yearList: Array<string>;
  pprPrototypesList: Array<IPprGeneralData>;
  handleClick: Function;
  dataForCreatingNewPpr: { prototypePlanId: string; year: string };
  dataSelect: Function;
}) {
  const {dataSelect, pprPrototypesList, yearList} = props;
  const { prototypePlanId, year } = props.dataForCreatingNewPpr;
  const prototypesOptions = pprPrototypesList.map((pprPrototype) => (
    <MenuItem key={pprPrototype.id} value={pprPrototype.id}>
      {pprPrototype.name}
    </MenuItem>
  ));
  const yearListOptions = yearList.map((year) => (
    <MenuItem key={year} value={year}>
      {year}
    </MenuItem>
  ));

  return (
    <Fragment>
      <FormLabel>Создать новый ППР</FormLabel>
      <FormControl required size="small" sx={{ minWidth: 240 }}>
        <InputLabel>Год</InputLabel>
        <Select autoWidth value={year} label="Год" onChange={(e) => dataSelect("year", e.target.value)}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {yearListOptions}
        </Select>
      </FormControl>
      <FormControl required size="small" sx={{ minWidth: 240 }}>
        <InputLabel>Прототип (шаблон) ППР</InputLabel>
        <Select autoWidth value={prototypePlanId} label="Прототип (шаблон) ППР" onChange={(e) => dataSelect("prototypePlanId", e.target.value)}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {prototypesOptions}
        </Select>
      </FormControl>
      <Button onClick={() => props.handleClick(year, prototypePlanId)} sx={{ color: "black" }} variant="outlined">
        Создать
      </Button>
    </Fragment>
  );
}
