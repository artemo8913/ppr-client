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
      for (let index = 0; index < state.value.length; index++) {
        const row = state.value[index];
        if (row.id !== action.payload.id) {
          continue;
        }
        if (action.payload.category.length === 1) {
          state.value.splice(index, 1, { ...state.value[index], [action.payload.category[0]]: action.payload.newValue });
          break;
        }
        if (action.payload.category.length === 2) {
          state.value.splice(index, 1, {
            ...state.value[index],
            [action.payload.category[0]]: {
              //@ts-ignore
              ...state.value[index][action.payload.category[0]],
              [action.payload.category[1]]: action.payload.newValue,
            },
          });
          break;
        }
      }
    },
  },
});

export const { addRow, removeRow, changeCellData } = pprSlice.actions;

export default pprSlice.reducer;
