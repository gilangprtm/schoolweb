# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\berita-crud.spec.ts >> Berita CRUD >> should create new berita
- Location: e2e\tests\berita-crud.spec.ts:43:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="title"]')

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
  1  | import { type Locator, type Page } from '@playwright/test';
  2  | 
  3  | export class BeritaPage {
  4  |   readonly page: Page;
  5  |   readonly addButton: Locator;
  6  |   readonly titleInput: Locator;
  7  |   readonly contentInput: Locator;
  8  |   readonly categorySelect: Locator;
  9  |   readonly saveButton: Locator;
  10 |   readonly successToast: Locator;
  11 |   readonly tableRows: Locator;
  12 | 
  13 |   constructor(page: Page) {
  14 |     this.page = page;
  15 |     this.addButton = page.locator('a[href*="new"], button:has-text("Tambah")').first();
  16 |     this.titleInput = page.locator('input[name="title"]');
  17 |     this.contentInput = page.locator('[data-testid="content-editor"], textarea[name="content"]');
  18 |     this.categorySelect = page.locator('select[name="category"]');
  19 |     this.saveButton = page.locator('button[type="submit"]');
  20 |     this.successToast = page.locator('[role="status"], .toast').first();
  21 |     this.tableRows = page.locator('table tbody tr');
  22 |   }
  23 | 
  24 |   async goto() {
  25 |     await this.page.goto('/admin/berita');
  26 |   }
  27 | 
  28 |   async gotoNew() {
  29 |     await this.page.goto('/admin/berita/new');
  30 |   }
  31 | 
  32 |   async create(title: string, content: string, category = 'news') {
> 33 |     await this.titleInput.fill(title);
     |                           ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  34 |     await this.contentInput.fill(content);
  35 |     if (await this.categorySelect.isVisible()) {
  36 |       await this.categorySelect.selectOption(category);
  37 |     }
  38 |     await this.saveButton.click();
  39 |   }
  40 | }
  41 | 
```