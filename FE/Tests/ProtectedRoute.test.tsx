import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import ProtectedRoute from '../src/Routing/Protection';

describe('Protected route', () => {
    it('Should render', () => {
        const { container } = customRender(<ProtectedRoute>{<></>}</ProtectedRoute>);
        expect(container).toBeTruthy();
    });
});
