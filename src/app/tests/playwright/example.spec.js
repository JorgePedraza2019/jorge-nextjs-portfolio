// example.spec.js
import { test, expect } from '@playwright/test';

test('visit the main page', async ({ page }) => {
    await page.goto('http://localhost:3000'); // Navigate to your website
    const title = await page.title(); // Get the page title
    expect(title).toBe('Create Next App'); // Check if the title matches the expected title
});