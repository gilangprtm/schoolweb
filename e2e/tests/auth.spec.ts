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

  test('should login via API and access admin', async ({ page, request }) => {
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@sekolah.sch.id';
    const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';
    
    const res = await request.post('/api/auth/sign-in/email', {
      data: { email, password },
    });
    expect(res.status()).toBe(200);
    const { token } = await res.json();
    
    await page.context().addCookies([{
      name: 'better-auth.session_token',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax' as const,
    }]);
    
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);
  });
});
