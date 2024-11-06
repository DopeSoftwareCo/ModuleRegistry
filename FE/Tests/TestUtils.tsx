import { render } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../src/Redux/store';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../src/Theme/Theme';
import { BrowserRouter } from 'react-router-dom';

export const customRender = (component: React.ReactElement) => {
    return render(
        <ReduxProvider store={store}>
            <ThemeProvider theme={darkTheme}>
                <BrowserRouter>{component}</BrowserRouter>
            </ThemeProvider>
        </ReduxProvider>
    );
};
