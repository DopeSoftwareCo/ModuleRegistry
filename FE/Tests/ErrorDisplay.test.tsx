import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { ErrorDisplay } from '../src/Components/ErrorDisplay/ErrorDisplay';
import { useState } from 'react';

const Parent = () => {
    const [err, setErr] = useState<string | undefined>('error');
    return <ErrorDisplay err={err} setErr={setErr} />;
};

describe('Error Display', () => {
    it('Should render', () => {
        const { container } = customRender(<Parent />);
        expect(container).toBeTruthy();
    });
});
