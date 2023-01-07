// мне не нравится применение splice для изменения значения
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mockRowData from "../../mock/rowData";

export const pprSlice = createSlice({
  name: "ppr",
  initialState: {
    value: mockRowData,
  },
  reducers: {
    addRow: (state) => {},
    removeRow: (state) => {},
    changeCellData: (state, action: PayloadAction<{ id: string; newValue: string | number; category: Array<string> }>) => {
      for (let index = 0; index < state.value.length; index++) {
        const row = state.value[index];
        if (row.rowId !== action.payload.id) {
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
