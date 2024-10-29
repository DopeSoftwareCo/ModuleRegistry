import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { MobileMenu } from '../src/Components/Nav/NavBar';

describe('Error Display', () => {
    it('Should render', () => {
        const { container } = customRender(<MobileMenu />);
        expect(container).toBeTruthy();
    });
});
