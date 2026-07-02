import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should show login page', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@sekolah.sch.id';
    const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';
    
    await loginPage.login(email, password);
    // Wait for navigation to admin (or stay on login if failed)
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/admin/);
  });
});
