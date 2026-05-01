# ImageKit integration (Uzhavan Tech)

This project uploads images to ImageKit and organizes them under a date-based folder structure.

Configuration
- Add these environment variables to your local `.env` (do not commit `.env`):

```
IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yourendpoint
```

- `vite.config.ts` is configured to inject these values into `process.env.*` for the client bundle.

Folder structure
- Uploads are stored in folders with the pattern `/crop-images/YYYY/MM/` so images are grouped by year and month.

Usage
- Use the `uploadImage(file: File): Promise<string>` helper exported from `services/imagekitService.ts`.
- A test component is included at `components/TestImageUpload.tsx` which demonstrates selecting a file and uploading it.

Security
- Do NOT commit `IMAGEKIT_PRIVATE_KEY` to public repositories. For production, use signed uploads (generate signatures server-side) as recommended by ImageKit: https://docs.imagekit.io/api-reference/upload-api/client-side-file-upload
