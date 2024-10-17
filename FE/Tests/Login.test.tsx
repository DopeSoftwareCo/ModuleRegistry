import Login from '../src/Pages/Login/Login';
import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';

describe('Login Component', () => {
    it('Should render', () => {
        const { container } = customRender(<Login />);
        expect(container).toBeTruthy();
    });
});
