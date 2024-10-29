import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { Footer } from '../src/Components/Footer/Footer';
describe('Error Display', () => {
    it('Should render', () => {
        const { container } = customRender(<Footer />);
        expect(container).toBeTruthy();
    });
});
