import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { detectRasterMime, savePublicImage, removeOwnedImage } from '@/lib/public-image-storage';

describe('public image storage', () => {
  const originalStorageDir = process.env.STORAGE_DIR;
  afterEach(async () => {
    if (originalStorageDir === undefined) delete process.env.STORAGE_DIR;
    else process.env.STORAGE_DIR = originalStorageDir;
  });

  it('detects raster signatures and rejects SVG regardless of declared MIME', () => {
    expect(detectRasterMime(Uint8Array.from([0xff, 0xd8, 0xff, 0x00]))).toBe('image/jpeg');
    expect(detectRasterMime(new TextEncoder().encode('<svg></svg>'))).toBeNull();
  });

  it('stores an opaque image, serves a stable local URL, and removes only owned URLs', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'schoolweb-images-'));
    process.env.STORAGE_DIR = dir;
    try {
      const png = Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,1,2]);
      const saved = await savePublicImage(png);
      expect(saved.url).toMatch(/^\/api\/public-images\/[0-9a-f-]+\.png$/);
      expect(await readFile(path.join(dir, 'images', path.basename(saved.url)))).toEqual(Buffer.from(png));
      await removeOwnedImage('https://example.com/image.png');
      await expect(readFile(path.join(dir, 'images', path.basename(saved.url)))).resolves.toEqual(Buffer.from(png));
      await removeOwnedImage(saved.url);
      await expect(readFile(path.join(dir, 'images', path.basename(saved.url)))).rejects.toMatchObject({ code: 'ENOENT' });
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
});
import {
  PostSchema,
  ContactSchema,
  CreateUserSchema,
  ChangePasswordSchema,
} from '@/lib/validations';

describe('PostSchema', () => {
  it('should accept valid post', () => {
    const result = PostSchema.safeParse({
      title: 'Test Post',
      slug: 'test-post',
      category: 'news',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const result = PostSchema.safeParse({
      title: '',
      slug: 'test',
    });
    expect(result.success).toBe(false);
  });

  it('should reject excerpt >200 chars', () => {
    const result = PostSchema.safeParse({
      title: 'Test',
      slug: 'test',
      excerpt: 'x'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('should default isPublished to false', () => {
    const result = PostSchema.parse({
      title: 'Test',
      slug: 'test',
    });
    expect(result.isPublished).toBe(false);
  });
});

describe('ContactSchema', () => {
  it('should accept valid contact', () => {
    const result = ContactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      message: 'Hello',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = ContactSchema.safeParse({
      name: 'John',
      email: 'not-an-email',
      message: 'Hello',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty message', () => {
    const result = ContactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      message: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateUserSchema', () => {
  it('should accept valid user', () => {
    const result = CreateUserSchema.safeParse({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject password <8 chars', () => {
    const result = CreateUserSchema.safeParse({
      name: 'Admin',
      email: 'admin@test.com',
      password: '1234567',
    });
    expect(result.success).toBe(false);
  });
});

describe('ChangePasswordSchema', () => {
  it('should accept matching passwords', () => {
    const result = ChangePasswordSchema.safeParse({
      oldPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject mismatched confirmPassword', () => {
    const result = ChangePasswordSchema.safeParse({
      oldPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
  });
});
