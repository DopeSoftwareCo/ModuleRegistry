import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface UserState {
    permissions?: string[];
    username?: string;
    token?: string;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    permissions: undefined,
    username: undefined,
    token: undefined,
    isAuthenticated: false,
};

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAllUser: (
            state,
            action: { payload: { permissions: string[]; username: string; token: string }; type: string }
        ) => {
            state.permissions = action.payload.permissions;
            state.username = action.payload.username;
            state.token = action.payload.token;
            if (action.payload.token) {
                state.isAuthenticated = true;
            }
        },
    },
});

export const { setAllUser } = UserSlice.actions;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export default UserSlice.reducer;
