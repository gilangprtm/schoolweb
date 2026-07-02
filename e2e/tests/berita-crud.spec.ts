import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { BeritaPage } from '../pages/berita.page';

test.describe('Berita CRUD', () => {
  let beritaPage: BeritaPage;
  const email = process.env.TEST_ADMIN_EMAIL || 'admin@sekolah.sch.id';
  const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';

  test.beforeEach(async ({ page, request }) => {
    // Login via API (lebih reliable daripada form submit)
    const res = await request.post('/api/auth/sign-in/email', {
      data: { email, password },
    });
    expect(res.status()).toBe(200);
    const { token } = await res.json();
    
    // Set auth cookie
    await page.context().addCookies([{
      name: 'better-auth.session_token',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax' as const,
    }]);
    
    beritaPage = new BeritaPage(page);
    await beritaPage.goto();
  });

  test('should display berita list page', async () => {
    await expect(beritaPage.addButton).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to create form', async ({ page }) => {
    await beritaPage.addButton.click();
    await expect(page).toHaveURL(/\/admin\/berita\/new/);
  });

  test('should create new berita', async ({ page }) => {
    const title = `Test Berita ${Date.now()}`;
    await beritaPage.gotoNew();
    await beritaPage.create(title, 'Konten test otomatis dari Playwright', 'news');
    
    await expect(beritaPage.successToast).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/berita/);
  });
});
