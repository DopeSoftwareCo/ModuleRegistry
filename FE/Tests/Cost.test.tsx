import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Cost from '../src/Pages/Cost/Cost';
import { costRequest } from '../src/Pages/Cost/Requests';

const costReturnMock = {
    '123912398123': {
        standaloneCost: 50.0,
        totalCost: 95.0,
    },
};

global.fetch = vitest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(costReturnMock),
    } as Response)
);

describe('Cost Component', () => {
    it('Should render the component', () => {
        const { container } = customRender(<Cost />);
        expect(container).toBeTruthy();
    });

    it('Should show standalone cost when dependencies are not included', async () => {
        customRender(<Cost />);

        fireEvent.change(screen.getByPlaceholderText('ID'), { target: { value: 'test-id' } });
        fireEvent.click(screen.getByTestId('cost-request-button'));

        await waitFor(() => {
            expect(screen.getByTestId('standalone-cost')).toBeDefined();
        });
    });

    it('Should show both standalone and total costs when dependencies are included', async () => {
        customRender(<Cost />);

        fireEvent.change(screen.getByPlaceholderText('ID'), { target: { value: 'test-id' } });
        fireEvent.click(screen.getByTestId('cost-request-button'));
        fireEvent.click(screen.getByRole('checkbox'));

        await waitFor(() => {
            expect(screen.getByTestId('standalone-cost')).toBeDefined();
            expect(screen.getByTestId('total-cost')).toBeDefined();
        });
    });

    it('Should handle error messages if API call fails', async () => {
        global.fetch = vitest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Error: Package not found'),
            } as Response)
        );

        customRender(<Cost />);
        fireEvent.change(screen.getByPlaceholderText('ID'), { target: { value: 'invalid-id' } });
        fireEvent.click(screen.getByTestId('cost-request-button'));

        await waitFor(() => {
            expect(screen.getByText('Error: Package not found')).toBeTruthy();
        });
    });
});

describe('costRequest API Function', () => {
    it('should return cost data when the API call is successful', async () => {
        global.fetch = vitest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ standaloneCost: 50.0, totalCost: 95.0 }),
            } as Response)
        );

        const errorSetter = vitest.fn();
        const result = await costRequest('test-id', true, errorSetter);
        expect(result).toEqual({ standaloneCost: 50.0, totalCost: 95.0 });
        expect(errorSetter).not.toHaveBeenCalled();
    });

    it('should call errorSetter on failed API call', async () => {
        global.fetch = vitest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Error: Something went wrong'),
            } as Response)
        );

        const errorSetter = vitest.fn();
        const result = await costRequest('invalid-id', true, errorSetter);

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('Error: Something went wrong');
    });

    it('should handle network errors gracefully', async () => {
        global.fetch = vitest.fn(() => Promise.reject(new Error('Network Error')));

        const errorSetter = vitest.fn();
        const result = await costRequest('network-error-id', true, errorSetter);

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('Network Error');
    });

    it('should handle unknown errors gracefully', async () => {
        // Simulate an error that is not an instance of Error
        global.fetch = vitest.fn(() => Promise.reject('Unknown Error'));

        const errorSetter = vitest.fn();
        const result = await costRequest('unknown-error-id', true, errorSetter);

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('An unknown error occurred in costRequest.');
    });
});
