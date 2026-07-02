'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Terjadi Kesalahan</h1>
          <p>Maaf, halaman ini tidak dapat ditampilkan.</p>
          <button onClick={reset} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
