import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pprHidingColumnsStates } from "../../settings";

export const pprUISlice = createSlice({
  name: "pprUI",
  initialState: {
    hidden: "none",
    uniteSameCells: false,
  },
  reducers: {
    toggleHiddenColumns: (state, action: PayloadAction<{ hiddenColumnsState: string }>) => {
      const newState = action.payload.hiddenColumnsState;
      const isValid = pprHidingColumnsStates.indexOf(newState) !== -1;
      if(isValid) state.hidden = newState;
    },
  },
});

export const {toggleHiddenColumns} = pprUISlice.actions;
export default pprUISlice.reducer;