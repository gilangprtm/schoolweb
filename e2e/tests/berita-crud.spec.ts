import { test, expect } from '@playwright/test';
import { BeritaPage } from '../pages/berita.page';

const AUTH_FILE = 'playwright/.auth/user.json';

test.describe('Berita CRUD', () => {
  // Gunakan saved auth state
  test.use({ storageState: AUTH_FILE });

  test('should display berita list', async ({ page }) => {
    const beritaPage = new BeritaPage(page);
    await beritaPage.goto();
    await expect(beritaPage.addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new berita', async ({ page }) => {
    const beritaPage = new BeritaPage(page);
    const title = `Test ${Date.now()}`;
    await beritaPage.gotoNew();
    await beritaPage.create(title, 'Konten test Playwright', 'news');
    await expect(beritaPage.successToast).toBeVisible({ timeout: 10000 });
  });
});
