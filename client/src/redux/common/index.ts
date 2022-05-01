import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  error: "",
  info: "",
};

const slice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setInfo(state, action: PayloadAction<string>) {
      state.info = action.payload;
    },
  },
});

export const { setError, setInfo } = slice.actions;
export default slice.reducer;
