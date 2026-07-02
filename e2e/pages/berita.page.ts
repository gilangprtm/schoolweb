import { type Locator, type Page } from '@playwright/test';

export class BeritaPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly titleInput: Locator;
  readonly contentInput: Locator;
  readonly categorySelect: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('a[href*="new"], button:has-text("Tambah")').first();
    this.titleInput = page.locator('input[name="title"]');
    this.contentInput = page.locator('[data-testid="content-editor"], textarea[name="content"]');
    this.categorySelect = page.locator('select[name="category"]');
    this.saveButton = page.locator('button[type="submit"]');
    this.successToast = page.locator('[role="status"], .toast').first();
    this.tableRows = page.locator('table tbody tr');
  }

  async goto() {
    await this.page.goto('/admin/berita');
  }

  async gotoNew() {
    await this.page.goto('/admin/berita/new');
  }

  async create(title: string, content: string, category = 'news') {
    await this.titleInput.fill(title);
    await this.contentInput.fill(content);
    if (await this.categorySelect.isVisible()) {
      await this.categorySelect.selectOption(category);
    }
    await this.saveButton.click();
  }
}
