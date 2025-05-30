import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import taskListSlice from "./taskList";

export const store = configureStore({
  reducer: {
    user: userSlice,
    taskList: taskListSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
