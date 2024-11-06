// example.spec.js
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();
test('visit the main page', async ({ page }) => {
    const port = process.env.NEXT_PORT;
    await page.goto(`http://localhost:${port}`); // Navigate to the website
    const title = await page.title(); // Get the page title
    expect(title).toBe('Create Next App'); // Check if the title matches the expected title
});