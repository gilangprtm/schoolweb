'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry capture (uncomment after installing @sentry/nextjs):
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.captureException(error);
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
          <h1>Terjadi Kesalahan</h1>
          <p>Maaf, halaman ini tidak dapat ditampilkan. Silakan coba lagi.</p>
          <button
            onClick={reset}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
