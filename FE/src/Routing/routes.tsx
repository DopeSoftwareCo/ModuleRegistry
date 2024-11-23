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
import Packages from '../Pages/Packages/Packages';
import {
    ALL_PERMS_ALLOWED,
    ALL_ROLES,
    DownloadPerms,
    Role,
    SearchPerms,
    UploadPerms,
} from '../BETypes/PermissionsRoles';
import { PermRoleError } from '../Pages/PermRoleError/PermRoleError';
import AdminDashboard from '../Pages/AdminDash/AdminDash';
import { Account } from '../Pages/Account/Account';

// eslint-disable-next-line react-refresh/only-export-components
const Home = React.lazy(() => import('../Pages/Home/Home'));
// eslint-disable-next-line react-refresh/only-export-components
const Login = React.lazy(() => import('../Pages/Login/Login'));

const routes = [
    {
        path: '/',
        element: (
            <ProtectedRoute validPermissions={ALL_PERMS_ALLOWED} validRoles={ALL_ROLES}>
                <Navigate to="/home" replace />{' '}
            </ProtectedRoute>
        ),
        label: 'none',
    },
    {
        path: '/permroleerror',
        element: (
            <ProtectedRoute validPermissions={ALL_PERMS_ALLOWED} validRoles={ALL_ROLES}>
                <PermRoleError />
            </ProtectedRoute>
        ),
        label: 'none',
    },
    {
        path: GeneralConfig.HOME_URL,
        element: (
            <ProtectedRoute validPermissions={SearchPerms} validRoles={ALL_ROLES}>
                {' '}
                <Home />{' '}
            </ProtectedRoute>
        ),
        label: 'home',
    },
    {
        path: GeneralConfig.REGEX_URL,
        element: (
            <ProtectedRoute validPermissions={SearchPerms} validRoles={ALL_ROLES}>
                <Regex />
            </ProtectedRoute>
        ),
        label: 'regex',
    },
    {
        path: GeneralConfig.DOWNLOAD_URL,
        element: (
            <ProtectedRoute validPermissions={DownloadPerms} validRoles={ALL_ROLES}>
                <Download />
            </ProtectedRoute>
        ),
        label: 'download',
    },
    {
        path: GeneralConfig.UPDATE_URL,
        element: (
            <ProtectedRoute validPermissions={UploadPerms} validRoles={ALL_ROLES}>
                <Update />
            </ProtectedRoute>
        ),
        label: 'update',
    },
    {
        path: GeneralConfig.RATING_URL,
        element: (
            <ProtectedRoute validPermissions={SearchPerms} validRoles={ALL_ROLES}>
                <Rating />
            </ProtectedRoute>
        ),
        label: 'rating',
    },
    {
        path: GeneralConfig.COST_URL,
        element: (
            <ProtectedRoute validPermissions={SearchPerms} validRoles={ALL_ROLES}>
                <Cost />
            </ProtectedRoute>
        ),
        label: 'cost',
    },
    {
        path: GeneralConfig.UPLOAD_URL,
        element: (
            <ProtectedRoute validPermissions={UploadPerms} validRoles={ALL_ROLES}>
                <Upload />
            </ProtectedRoute>
        ),
        label: 'upload',
    },
    {
        path: GeneralConfig.RESET_URL,
        element: (
            <ProtectedRoute validPermissions={ALL_PERMS_ALLOWED} validRoles={[Role.Admin]}>
                <Reset />
            </ProtectedRoute>
        ),
        label: 'reset',
    },
    {
        path: GeneralConfig.PACKAGES_URL,
        element: (
            <ProtectedRoute validPermissions={SearchPerms} validRoles={ALL_ROLES}>
                <Packages />
            </ProtectedRoute>
        ),
        label: 'packages',
    },
    {
        path: GeneralConfig.ADMIN_DASH_URL,
        element: (
            <ProtectedRoute validPermissions={ALL_PERMS_ALLOWED} validRoles={[Role.Admin]}>
                <AdminDashboard />
            </ProtectedRoute>
        ),
        label: 'admin',
    },
    {
        path: GeneralConfig.ACCOUNT_URL,
        element: (
            <ProtectedRoute validPermissions={ALL_PERMS_ALLOWED} validRoles={ALL_ROLES}>
                <Account />
            </ProtectedRoute>
        ),
        label: 'account',
    },
    { path: GeneralConfig.AUTH_URL, element: <Login /> },
];

export default routes;
