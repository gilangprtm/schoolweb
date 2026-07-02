# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\berita-crud.spec.ts >> Berita CRUD >> should navigate to create form
- Location: e2e\tests\berita-crud.spec.ts:36:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a[href*="new"], button:has-text("Tambah")').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e7]:
      - heading "Masuk" [level=2] [ref=e8]
      - paragraph [ref=e9]: Masukkan kredensial untuk melanjutkan
    - generic [ref=e10]:
      - generic [ref=e11]:
        - text: Email
        - textbox "admin@sekolah.sch.id" [ref=e12]
      - generic [ref=e13]:
        - text: Password
        - generic [ref=e14]:
          - textbox "••••••••" [ref=e15]
          - button [ref=e16]:
            - img [ref=e17]
      - button "Masuk" [ref=e20]:
        - generic [ref=e21]:
          - text: Masuk
          - img
    - paragraph [ref=e22]: © 2026 SMP Negeri 17 Denpasar
  - alert [ref=e23]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from '../pages/login.page';
  3  | import { BeritaPage } from '../pages/berita.page';
  4  | 
  5  | test.describe('Berita CRUD', () => {
  6  |   let beritaPage: BeritaPage;
  7  | 
  8  |   test.beforeEach(async ({ page, request }) => {
  9  |     const email = process.env.TEST_ADMIN_EMAIL || 'admin@sekolah.sch.id';
  10 |     const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';
  11 |     
  12 |     // Login via API
  13 |     const res = await request.post('/api/auth/sign-in/email', {
  14 |       data: { email, password },
  15 |     });
  16 |     expect(res.status()).toBe(200);
  17 |     const { token } = await res.json();
  18 |     
  19 |     // Gunakan token di header untuk subsequent requests
  20 |     await page.context().setExtraHTTPHeaders({
  21 |       'Authorization': `Bearer ${token}`,
  22 |     });
  23 |     
  24 |     beritaPage = new BeritaPage(page);
  25 |   });
  26 | 
  27 |   test('should display berita list page', async ({ page }) => {
  28 |     await page.goto('/admin/berita');
  29 |     await page.waitForLoadState('networkidle');
  30 |     // Will redirect to login if auth fails
  31 |     const url = page.url();
  32 |     expect(url).toMatch(/\/admin/);
  33 |     await expect(beritaPage.addButton).toBeVisible({ timeout: 5000 });
  34 |   });
  35 | 
  36 |   test('should navigate to create form', async ({ page }) => {
  37 |     await page.goto('/admin/berita');
  38 |     await page.waitForLoadState('networkidle');
> 39 |     await beritaPage.addButton.click();
     |                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  40 |     await expect(page).toHaveURL(/\/admin\/berita\/new/);
  41 |   });
  42 | 
  43 |   test('should create new berita', async ({ page }) => {
  44 |     const title = `Test ${Date.now()}`;
  45 |     await page.goto('/admin/berita/new');
  46 |     await beritaPage.create(title, 'Konten test Playwright', 'news');
  47 |     await expect(beritaPage.successToast).toBeVisible({ timeout: 10000 });
  48 |   });
  49 | });
  50 | 
```