import { Reporter } from '@jest/reporters';
import fs, { existsSync, mkdirSync } from 'fs';

class CustomReporter implements Reporter {
    onRunComplete(contexts: Set<unknown>, results: any): void {
        if (!existsSync('./coverage/')) {
            mkdirSync('./coverage/');
        }
        const output = `Tests: ${results.numPassedTests} passed, ${results.numTotalTests} total`;
        fs.writeFileSync('./coverage/output.txt', output);
    }
}

export default CustomReporter;
