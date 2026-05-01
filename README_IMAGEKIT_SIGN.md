ImageKit Signed Upload (local dev)
================================

This project supports a signed-upload flow for ImageKit to avoid exposing the private key in the browser.

Quick setup (local):

1. Install server deps for the signing endpoint:

```powershell
npm install express imagekit cors
```

2. Set environment variables (do NOT commit):

```text
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://upload.imagekit.io/api/v1/files/upload
```

3. Start the signing server:

```powershell
npm run start-signer
```

4. Start the frontend dev server (if not running):

```powershell
npm run dev
```

The frontend will call `/api/sign-imagekit` to obtain auth params and perform a signed upload to ImageKit.

If the signing server is not running, the client will attempt an unsigned upload with the `IMAGEKIT_PUBLIC_KEY` (if present), but many ImageKit accounts require signed uploads.
