import { describe, it, expect } from 'vitest';
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
