import { configureStore, Store } from "@reduxjs/toolkit";

export const store: Store = configureStore({
    reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
