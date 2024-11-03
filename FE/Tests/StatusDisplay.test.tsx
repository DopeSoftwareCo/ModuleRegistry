import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { useState } from 'react';
import { StatusDisplay } from '../src/Components/StatusDisplay/StatusDisplay';

const Parent = () => {
    const [err, setErr] = useState<string | undefined>('error');
    const [s, ss] = useState<string | undefined>('');
    return <StatusDisplay err={err} setErr={setErr} successMessage={s} setSuccess={ss} />;
};

describe('Error Display', () => {
    it('Should render', () => {
        const { container } = customRender(<Parent />);
        expect(container).toBeTruthy();
    });
});
