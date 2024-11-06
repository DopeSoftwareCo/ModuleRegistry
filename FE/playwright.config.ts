// playwright.config.ts or playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    globalSetup: './Tests-UI/GlobalSetup.ts',
    use: {
        baseURL: 'http://localhost:5173',
    },
    webServer: {
        command: 'npm run dev',
        timeout: 120 * 1000,
    },
    testDir: './Tests-UI', // Path to the folder containing your test files
    outputDir: './playwright-results',
    reporter: [['html', { outputFolder: 'playwright-report', open: 'always' }]],
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
