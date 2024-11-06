import { test, expect } from '@playwright/test';

test.describe('Page Render Tests', () => {
    test('other urls should redirect to auth page', async ({ page, baseURL }) => {
        await page.goto('/home');
        await expect(page).toHaveTitle(/ModuleRegistry/);
        await page.waitForURL(`${baseURL}/auth`);
        await expect(page.url()).toBe(`${baseURL}/auth`);
    });

    test('Auth url should render', async ({ page, baseURL }) => {
        await page.goto('/auth');
        await expect(page).toHaveTitle(/ModuleRegistry/);
        await page.waitForURL(`${baseURL}/auth`);
        await expect(page.url()).toBe(`${baseURL}/auth`);
    });
});
