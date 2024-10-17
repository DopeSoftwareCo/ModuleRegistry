import { configureStore, Store } from '@reduxjs/toolkit';
import { UserSlice } from './UserSlice';

export const store: Store = configureStore({
    reducer: {
        user: UserSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
