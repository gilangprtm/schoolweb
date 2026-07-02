import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('API Integration Tests', () => {
  let authToken: string;

  // ═══════════════════════════════════════════
  // Public endpoints
  // ═══════════════════════════════════════════

  describe('Public API', () => {
    it('GET /api/health should return ok', async () => {
      const res = await fetch(`${BASE_URL}/api/health`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });

    it('GET / should return HTML', async () => {
      const res = await fetch(`${BASE_URL}/`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/html');
    });

    it('GET /berita should return HTML', async () => {
      const res = await fetch(`${BASE_URL}/berita`);
      expect(res.status).toBe(200);
    });
  });

  // ═══════════════════════════════════════════
  // Auth API
  // ═══════════════════════════════════════════

  describe('Auth API', () => {
    it('POST /api/auth/sign-in/email with valid creds', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@sekolah.sch.id',
          password: 'admin123',
        }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.token).toBeDefined();
      expect(body.user.email).toBe('admin@sekolah.sch.id');
      authToken = body.token;
    });

    it('POST /api/auth/sign-in/email with invalid creds', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@email.com',
          password: 'wrong',
        }),
      });
      // Better Auth returns different status for invalid
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  // ═══════════════════════════════════════════
  // Security headers
  // ═══════════════════════════════════════════

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const res = await fetch(`${BASE_URL}/api/health`);
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
      expect(res.headers.get('x-frame-options')).toBe('DENY');
    });
  });

  // ═══════════════════════════════════════════
  // Admin endpoints (need auth)
  // ═══════════════════════════════════════════

  describe('Admin API (protected)', () => {
    it('GET /admin should redirect to login when unauthenticated', async () => {
      const res = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' });
      expect(res.status).toBeGreaterThanOrEqual(300);
    });

    // Note: Authenticated admin tests require session cookie
    // Blocked by Better Auth session mechanism (documented)
    it.todo('GET /admin with valid session should return 200');
    it.todo('POST /admin/berita should create new post');
  });
});
