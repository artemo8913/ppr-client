import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mockRowData from "../../mock/rowData";
import { fullInfoColumnsList, fullWorkAndTimeColumnsList, fullMounthsList, pprStatuses } from "../../settings";
import { IRowData } from "../../Interface";

function createNewEmptyRaw(
  id: string,
  fullInfoColumnsList: Array<string>,
  fullWorkAndTimeColumnsList: Array<string>,
  fullMounthsList: Array<string>
) {
  const newRow: any = {};
  fullInfoColumnsList.forEach((col) => {
    newRow[col] = "";
  });
  fullWorkAndTimeColumnsList.forEach((col) => {
    fullMounthsList.forEach((mounth) => {
      newRow[col] = newRow[col] ? { ...newRow[col], [mounth]: 0 } : { [mounth]: 0 };
    });
  });
  newRow.id = id;
  return newRow;
}

export const pprDataSlice = createSlice({
  name: "pprData",
  initialState: {
    id: "",
    name: "",
    year: "",
    status: "none",
    fulfullingMounth: "year",
    idDirection: 1,
    idDistance: 1,
    idSubdivision: 1,
    dirName: "Красноярская дирекция по энергообеспечению",
    disName: "Красноярская дистанция электроснабжения",
    subName: "Район контактной сети ЭЧК-9",
    dirNameShort: "КрасНТЭ",
    disNameShort: "ЭЧ-3",
    subNameShort: "ЭЧК-9",
    data: mockRowData,
  },
  reducers: {
    toggleStatus: (state, action: PayloadAction<{ status: string }>) => {
      const newStatus = action.payload.status;
      const isValid = pprStatuses.indexOf(newStatus) !== -1;
      if (isValid) state.status = newStatus;
    },
    toggleFulfullingMounth: (state, action: PayloadAction<{ mounth: string }>) => {
      const mounth = action.payload.mounth;
      const isValid = fullMounthsList.indexOf(mounth) !== -1;
      if (isValid) state.fulfullingMounth = mounth;
    },
    addData: (state, action: PayloadAction<{ id: string }>) => {
      const newRow = createNewEmptyRaw(action.payload.id, fullInfoColumnsList, fullWorkAndTimeColumnsList, fullMounthsList);
      state.data.push(newRow as IRowData);
    },
    removeData: (state, action: PayloadAction<{ id: string }>) => {
      state.data = state.data.filter((el) => el.id !== action.payload.id);
    },
    changeCellData: (state, action: PayloadAction<{ id: string; newValue: string | number; category: Array<string> }>) => {
      const id = action.payload.id;
      const firstPartOfCategory = action.payload.category[0];
      const secondPartOfCategory = action.payload.category[1];
      const newValue = action.payload.newValue;
      state.data.forEach((row) => {
        if (row.id !== id) return;
        //@ts-ignore
        else if (firstPartOfCategory && !secondPartOfCategory) row[firstPartOfCategory] = newValue;
        //@ts-ignore
        else if (firstPartOfCategory && secondPartOfCategory) row[firstPartOfCategory][secondPartOfCategory] = newValue;
      });
    },
  },
});

export const { addData, removeData, changeCellData, toggleStatus, toggleFulfullingMounth } = pprDataSlice.actions;

export default pprDataSlice.reducer;
