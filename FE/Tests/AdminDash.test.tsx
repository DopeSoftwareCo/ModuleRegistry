import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../src/Pages/AdminDash/AdminDash';
import { AllUsersFromAPI, getAllUsers } from '../src/Pages/AdminDash/Requests';

const allUsersReturnMock: AllUsersFromAPI = {
    users: [
        {
            username: 'TEST-USERNAME',
            user_id: 'TEST-USER-ID',
            user_metadata: {
                permission: 7,
                role: 3,
            },
        },
    ],
};

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        json: () => Promise.resolve(allUsersReturnMock),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Admin Dash', () => {
    it('Should render', async () => {
        await act(async () => {
            const { container } = customRender(<AdminDashboard />);
            expect(container).toBeTruthy();
        });
    });
    it('Should initially show add form initially', async () => {
        await act(async () => {
            customRender(<AdminDashboard />);
        });
        await waitFor(() => {
            expect(screen.getByTestId('add-user-container')).toBeDefined();
        });
    });
    it('Should show a mocked user initially', async () => {
        await act(async () => {
            customRender(<AdminDashboard />);
        });
        await waitFor(() => {
            expect(screen.getByText(allUsersReturnMock.users[0].user_id)).toBeDefined();
            expect(screen.getByText(allUsersReturnMock.users[0].username)).toBeDefined();
        });
    });
    it('Should show update form after update button click', async () => {
        await act(async () => {
            customRender(<AdminDashboard />);
        });
        fireEvent.click(screen.getByTestId('dashboard-update-menu-button'));
        await waitFor(() => {
            expect(screen.getByTestId('admin-dash-update-user-container')).toBeDefined();
        });
    });
    it('Should show delete user after delete button click', async () => {
        await act(async () => {
            customRender(<AdminDashboard />);
        });
        fireEvent.click(screen.getByTestId('dashboard-delete-menu-button'));
        await waitFor(() => {
            expect(screen.getByTestId('admin-dash-delete-user-container')).toBeDefined();
        });
    });
});

describe('Admin dash requests', () => {
    it('Should retrieve users', async () => {
        const users = await getAllUsers((err) => {
            throw new Error(err);
        });
        expect(users).toBeDefined();

        users?.users.forEach((user) => {
            expect(user.user_id).toBe(allUsersReturnMock.users[0].user_id);
            expect(user.username).toBe(allUsersReturnMock.users[0].username);
            expect(user.user_metadata.permission).toBe(allUsersReturnMock.users[0].user_metadata.permission);
            expect(user.user_metadata.role).toBe(allUsersReturnMock.users[0].user_metadata.role);
        });
    });
});
