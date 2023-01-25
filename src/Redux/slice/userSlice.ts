import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../Interface";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    login: "asd",
    roles: [""],
    id_subdivision: "1",
    id_distance: "1",
    id_direction: "1",
  },
  reducers: {
    setUser: (state, action: PayloadAction<{ user: IUser }>) => {
      state = action.payload.user;
    },
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
