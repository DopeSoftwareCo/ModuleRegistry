import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import routes from "./Routing/routes";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./Theme/Theme";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import { FourOHFour } from "./Components/ErrorBoundary/404";

function App() {
    const router = createBrowserRouter([
        {
            element: <Layout />,
            errorElement: <FourOHFour />,
            children: routes,
        },
    ]);
    return (
        <ThemeProvider theme={lightTheme}>
            <ErrorBoundary>
                <RouterProvider router={router} />
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
