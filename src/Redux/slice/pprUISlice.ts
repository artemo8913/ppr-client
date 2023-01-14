import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pprHidingColumnsStates } from "../../settings";

export const pprUISlice = createSlice({
  name: "pprUI",
  initialState: {
    hidden: "none",
    uniteCells: false,
    editableState: "none",
  },
  reducers: {
    toggleHiddenColumns: (state, action: PayloadAction<{ hiddenColumnsState: string }>) => {
      const newState = action.payload.hiddenColumnsState;
      const isValid = pprHidingColumnsStates.indexOf(newState) !== -1;
      if (isValid) state.hidden = newState;
    },
    toggleUniteCells: (state, action: PayloadAction<{ shouldUnit: boolean }>) => {
      state.uniteCells = action.payload.shouldUnit;
    },
    toggleEditableState: (state, action: PayloadAction<{status: string, fulfullingMounth: string}>) => {
      const status = action.payload.status;
      const fulfullingMounth = action.payload.fulfullingMounth;
      if (state.editableState !== "planning" && status === "creating" && fulfullingMounth === "year") {
        state.editableState = "planning";
      } else if (state.editableState !== "fulfilling" && status === "fulfilling" && fulfullingMounth !== "year") {
        state.editableState = "fulfilling";
      } else if (state.editableState !== "none") {
        state.editableState = "none";
      }
      console.log(fulfullingMounth,status,state.editableState);
    },
  },
});

export const { toggleHiddenColumns, toggleUniteCells, toggleEditableState } = pprUISlice.actions;
export default pprUISlice.reducer;
