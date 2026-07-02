# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\auth.spec.ts >> Authentication >> should login successfully with valid credentials
- Location: e2e\tests\auth.spec.ts:23:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin/
Received string:  "http://localhost:3000/login?from=%2Fadmin%2Flogin"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × unexpected value "http://localhost:3000/login?from=%2Fadmin%2Flogin"

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
  3  | 
  4  | test.describe('Authentication', () => {
  5  |   let loginPage: LoginPage;
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     loginPage = new LoginPage(page);
  9  |     await loginPage.goto();
  10 |   });
  11 | 
  12 |   test('should show login page', async () => {
  13 |     await expect(loginPage.emailInput).toBeVisible();
  14 |     await expect(loginPage.passwordInput).toBeVisible();
  15 |     await expect(loginPage.submitButton).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should show error for invalid credentials', async () => {
  19 |     await loginPage.login('wrong@email.com', 'wrongpassword');
  20 |     await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  21 |   });
  22 | 
  23 |   test('should login successfully with valid credentials', async ({ page }) => {
  24 |     const email = process.env.TEST_ADMIN_EMAIL || 'admin@sekolah.sch.id';
  25 |     const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';
  26 |     
  27 |     await loginPage.login(email, password);
> 28 |     await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  29 |   });
  30 | });
  31 | 
```