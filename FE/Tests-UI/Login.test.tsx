import { test, expect } from '@playwright/test';

test.describe('Login E2E', () => {
    test('Should login with default user', async ({ page, baseURL }) => {
        await page.goto('/auth');
        await page.waitForURL(`${baseURL}/auth`);

        const usernameField = await page.getByPlaceholder('username');
        const passwordField = await page.getByPlaceholder('password');
        await usernameField.fill('defaultuser');
        await passwordField.fill('GRP1_swe!');

        const loginButton = await page.getByRole('button', { name: 'Login' });
        await loginButton.click();

        await usernameField.fill('defaultuser');

        await page.waitForURL(`${baseURL}/home`);
        await expect(page.url()).toBe(`${baseURL}/home`);
    });
});
