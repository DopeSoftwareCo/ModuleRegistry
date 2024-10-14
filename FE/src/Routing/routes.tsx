import React from 'react';
import { GeneralConfig } from '../Config/config';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
const Home = React.lazy(() => import('../Pages/Home/Home'));
// eslint-disable-next-line react-refresh/only-export-components
const Login = React.lazy(() => import('../Pages/Login/Login'));

const routes = [
    { path: '/', element: <Navigate to="/auth" replace /> },
    { path: GeneralConfig.HOME_URL, element: <Home /> },
    { path: GeneralConfig.AUTH_URL, element: <Login /> },
];

export default routes;
