# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\auth.spec.ts >> Authentication >> should login via API and access admin
- Location: e2e\tests\auth.spec.ts:22:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin/
Received string:  "http://localhost:3000/login?from=%2Fadmin"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://localhost:3000/login?from=%2Fadmin"

```

```yaml
- heading "Masuk" [level=2]
- paragraph: Masukkan kredensial untuk melanjutkan
- text: Email
- textbox "admin@sekolah.sch.id"
- text: Password
- textbox "••••••••"
- button
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
  15 |   });
  16 | 
  17 |   test('should reject invalid credentials', async () => {
  18 |     await loginPage.login('wrong@email.com', 'wrongpassword');
  19 |     await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  20 |   });
  21 | 
  22 |   test('should login via API and access admin', async ({ page, request }) => {
  23 |     const res = await request.post('/api/auth/sign-in/email', {
  24 |       data: { email: 'admin@sekolah.sch.id', password: 'admin123' },
  25 |     });
  26 |     expect(res.status()).toBe(200);
  27 |     const { token } = await res.json();
  28 |     
  29 |     await page.context().setExtraHTTPHeaders({
  30 |       'Authorization': `Bearer ${token}`,
  31 |     });
  32 |     
  33 |     await page.goto('/admin');
> 34 |     await expect(page).toHaveURL(/\/admin/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  35 |   });
  36 | });
  37 | 
```