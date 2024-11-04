import React from 'react';
import { GeneralConfig } from '../Config/config';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './Protection';
import Regex from '../Pages/Regex/Regex';
import Download from '../Pages/Download/Download';
import Update from '../Pages/Update/Update';
import Rating from '../Pages/Rating/Rating';
import Cost from '../Pages/Cost/Cost';
import Upload from '../Pages/Upload/Upload';
import Reset from '../Pages/Reset/Reset';

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
        label: 'none',
    },
    {
        path: GeneralConfig.HOME_URL,
        element: (
            <ProtectedRoute>
                {' '}
                <Home />{' '}
            </ProtectedRoute>
        ),
        label: 'home',
    },
    {
        path: GeneralConfig.REGEX_URL,
        element: (
            <ProtectedRoute>
                <Regex />
            </ProtectedRoute>
        ),
        label: 'regex',
    },
    {
        path: GeneralConfig.DOWNLOAD_URL,
        element: (
            <ProtectedRoute>
                <Download />
            </ProtectedRoute>
        ),
        label: 'download',
    },
    {
        path: GeneralConfig.UPDATE_URL,
        element: (
            <ProtectedRoute>
                <Update />
            </ProtectedRoute>
        ),
        label: 'update',
    },
    {
        path: GeneralConfig.RATING_URL,
        element: (
            <ProtectedRoute>
                <Rating />
            </ProtectedRoute>
        ),
        label: 'rating',
    },
    {
        path: GeneralConfig.COST_URL,
        element: (
            <ProtectedRoute>
                <Cost />
            </ProtectedRoute>
        ),
        label: 'cost',
    },
    {
        path: GeneralConfig.UPLOAD_URL,
        element: (
            <ProtectedRoute>
                <Upload />
            </ProtectedRoute>
        ),
        label: 'upload',
    },
    {
        path: GeneralConfig.RESET_URL,
        element: (
            <ProtectedRoute>
                <Reset />
            </ProtectedRoute>
        ),
        label: 'reset',
    },
    { path: GeneralConfig.AUTH_URL, element: <Login /> },
];

export default routes;
