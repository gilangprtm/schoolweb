# Public image storage

Admin uploads are stored outside Next.js build output at `STORAGE_DIR` (default `./storage` for local development). The app creates a private `images/` subdirectory and server-generated filenames. Keep the directory on persistent storage and include it in backups.

The repository Docker runtime sets `STORAGE_DIR=/app/storage` and prepares that path writable by UID/GID 1001 (`nextjs`). In Coolify, attach a persistent volume to the application container at exactly `/app/storage`; make a bind-mounted directory writable by UID/GID 1001. Do not expose the directory directly from the reverse proxy. No Coolify settings or production data were changed. Existing Drive and external URLs are not imported or modified.
