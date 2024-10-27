import { createSlice } from '@reduxjs/toolkit';
import { DefaultTheme } from 'styled-components';
import { lightTheme, darkTheme } from '../Theme/Theme';
import { RootState } from './store';

interface ThemeState {
    theme: DefaultTheme;
}

const initialState: ThemeState = {
    theme: lightTheme,
};

export const ThemeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        swapTheme: (state) => {
            if (state.theme.colors.background === darkTheme.colors.background) {
                state.theme = lightTheme;
            } else if (state.theme.colors.background === lightTheme.colors.background) {
                state.theme = darkTheme;
            }
        },
    },
});

export const { swapTheme } = ThemeSlice.actions;
export const selectActiveTheme = (state: RootState) => state.theme.theme;
export default ThemeSlice.reducer;
