import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const AUTH_FILE = 'playwright/.auth/user.json';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('should reject invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('setup auth state', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@sekolah.sch.id');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin
    await page.waitForURL('**/admin', { timeout: 10000 });
    await expect(page.locator('h1, h2, [data-testid="dashboard"]').first()).toBeVisible();
    
    // Save auth state for other tests
    await page.context().storageState({ path: AUTH_FILE });
  });
});
