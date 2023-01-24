import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    login: "asd",
    roles: [""],
    id_subdivision: 0,
    id_distance: 0,
    id_direction: 0,
  },
  reducers: {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
