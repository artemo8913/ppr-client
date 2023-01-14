import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    login: "asd",
    roles: [""],
    division: "",
  },
  reducers: {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
