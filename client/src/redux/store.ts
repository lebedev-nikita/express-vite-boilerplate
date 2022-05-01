import { configureStore } from "@reduxjs/toolkit";

import commonReducer from "./common";
import homeReducer from "./pages/Home";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    Home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
