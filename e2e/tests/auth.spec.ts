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
  });

  test('should reject invalid credentials', async () => {
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should login via API and access admin', async ({ page, request }) => {
    const res = await request.post('/api/auth/sign-in/email', {
      data: { email: 'admin@sekolah.sch.id', password: 'admin123' },
    });
    expect(res.status()).toBe(200);
    const { token } = await res.json();
    
    await page.context().setExtraHTTPHeaders({
      'Authorization': `Bearer ${token}`,
    });
    
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);
  });
});
