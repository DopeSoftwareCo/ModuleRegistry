import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import routes from './Routing/routes';
import { ThemeProvider } from 'styled-components';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import { FourOHFour } from './Components/ErrorBoundary/404';
import { useSelector } from 'react-redux';
import { selectActiveTheme } from './Redux/ThemeSlice';

function App() {
    const router = createBrowserRouter([
        {
            element: <Layout />,
            errorElement: <FourOHFour />,
            children: routes,
        },
    ]);
    const currTheme = useSelector(selectActiveTheme);
    return (
        <ThemeProvider theme={currTheme}>
            <ErrorBoundary>
                <RouterProvider router={router} />
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
