# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\berita-crud.spec.ts >> Berita CRUD >> should navigate to create form
- Location: e2e\tests\berita-crud.spec.ts:24:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin/
Received string:  "http://localhost:3000/login"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × unexpected value "http://localhost:3000/login"

```

```yaml
- heading "Masuk" [level=2]
- paragraph: Masukkan kredensial untuk melanjutkan
- text: Email
- textbox "admin@sekolah.sch.id"
- text: Password
- textbox "••••••••": admin123
- button
- text: Terjadi kesalahan. Silakan coba lagi.
- button "Masuk"
- paragraph: © 2026 SMP Negeri 17 Denpasar
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from '../pages/login.page';
  3  | import { BeritaPage } from '../pages/berita.page';
  4  | 
  5  | test.describe('Berita CRUD', () => {
  6  |   let beritaPage: BeritaPage;
  7  |   const email = process.env.TEST_ADMIN_EMAIL || 'admin@sekolah.sch.id';
  8  |   const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';
  9  | 
  10 |   test.beforeEach(async ({ page }) => {
  11 |     const loginPage = new LoginPage(page);
  12 |     await loginPage.goto();
  13 |     await loginPage.login(email, password);
> 14 |     await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  15 |     
  16 |     beritaPage = new BeritaPage(page);
  17 |     await beritaPage.goto();
  18 |   });
  19 | 
  20 |   test('should display berita list page', async () => {
  21 |     await expect(beritaPage.addButton).toBeVisible({ timeout: 5000 });
  22 |   });
  23 | 
  24 |   test('should navigate to create form', async ({ page }) => {
  25 |     await beritaPage.addButton.click();
  26 |     await expect(page).toHaveURL(/\/admin\/berita\/new/);
  27 |   });
  28 | 
  29 |   test('should create new berita', async ({ page }) => {
  30 |     const title = `Test Berita ${Date.now()}`;
  31 |     await beritaPage.gotoNew();
  32 |     await beritaPage.create(title, 'Konten test otomatis dari Playwright', 'news');
  33 |     
  34 |     await expect(beritaPage.successToast).toBeVisible({ timeout: 10000 });
  35 |     await expect(page).toHaveURL(/\/admin\/berita/);
  36 |   });
  37 | });
  38 | 
```