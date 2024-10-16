import React from 'react';
import { GeneralConfig } from '../Config/config';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './Protection';

// eslint-disable-next-line react-refresh/only-export-components
const Home = React.lazy(() => import('../Pages/Home/Home'));
// eslint-disable-next-line react-refresh/only-export-components
const Login = React.lazy(() => import('../Pages/Login/Login'));

const routes = [
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Navigate to="/home" replace />{' '}
            </ProtectedRoute>
        ),
    },
    {
        path: GeneralConfig.HOME_URL,
        element: (
            <ProtectedRoute>
                {' '}
                <Home />{' '}
            </ProtectedRoute>
        ),
    },
    { path: GeneralConfig.AUTH_URL, element: <Login /> },
];

export default routes;
