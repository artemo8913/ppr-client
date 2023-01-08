import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mockRowData from "../../mock/rowData";
import { fullInfoColumnsList, fullWorkAndTimeColumnsList, fullMounthsList } from "../../settings";
import { IRowData, IMounthData } from "../../Interface";

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
export const pprSlice = createSlice({
  name: "ppr",
  initialState: {
    value: mockRowData,
  },
  reducers: {
    addRow: (state, action: PayloadAction<{ id: string }>) => {
      const newRow = createNewEmptyRaw(action.payload.id, fullInfoColumnsList, fullWorkAndTimeColumnsList, fullMounthsList);
      state.value.push(newRow as IRowData);
    },
    removeRow: (state) => {},
    changeCellData: (state, action: PayloadAction<{ id: string; newValue: string | number; category: Array<string> }>) => {
      const id = action.payload.id;
      const firstPartOfCategory = action.payload.category[0];
      const secondPartOfCategory = action.payload.category[1];
      const newValue = action.payload.newValue;
      state.value.forEach(row => {
        if (row.id !== id) return;
        //@ts-ignore
        else if(firstPartOfCategory && !secondPartOfCategory) row[firstPartOfCategory] = newValue;
        //@ts-ignore
        else if(firstPartOfCategory && secondPartOfCategory) row[firstPartOfCategory][secondPartOfCategory] = newValue;
      });
    },
  },
});

export const { addRow, removeRow, changeCellData } = pprSlice.actions;

export default pprSlice.reducer;
