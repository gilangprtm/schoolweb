import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { BeritaPage } from '../pages/berita.page';

test.describe('Berita CRUD', () => {
  let beritaPage: BeritaPage;

  test.beforeEach(async ({ page, request }) => {
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@sekolah.sch.id';
    const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';
    
    // Login via API
    const res = await request.post('/api/auth/sign-in/email', {
      data: { email, password },
    });
    expect(res.status()).toBe(200);
    const { token } = await res.json();
    
    // Gunakan token di header untuk subsequent requests
    await page.context().setExtraHTTPHeaders({
      'Authorization': `Bearer ${token}`,
    });
    
    beritaPage = new BeritaPage(page);
  });

  test('should display berita list page', async ({ page }) => {
    await page.goto('/admin/berita');
    await page.waitForLoadState('networkidle');
    // Will redirect to login if auth fails
    const url = page.url();
    expect(url).toMatch(/\/admin/);
    await expect(beritaPage.addButton).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to create form', async ({ page }) => {
    await page.goto('/admin/berita');
    await page.waitForLoadState('networkidle');
    await beritaPage.addButton.click();
    await expect(page).toHaveURL(/\/admin\/berita\/new/);
  });

  test('should create new berita', async ({ page }) => {
    const title = `Test ${Date.now()}`;
    await page.goto('/admin/berita/new');
    await beritaPage.create(title, 'Konten test Playwright', 'news');
    await expect(beritaPage.successToast).toBeVisible({ timeout: 10000 });
  });
});
