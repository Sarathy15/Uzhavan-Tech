#!/usr/bin/env node
/**
 * Simple signing endpoint for ImageKit uploads.
 *
 * Usage (local dev):
 * 1. Install dependencies: npm install express imagekit cors
 * 2. Set env vars (do NOT commit):
 *    IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT
 * 3. Run: npm run start-signer
 *
 * The endpoint exposes GET /api/sign-imagekit which returns JSON:
 * { token, expire, signature, publicKey }
 */

// Load environment variables from .env when present (local dev). Do NOT commit .env files.
import 'dotenv/config';

import express from 'express';
import ImageKit from 'imagekit';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.SIGN_SERVER_PORT || 4000;

const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

if (!PUBLIC_KEY || !PRIVATE_KEY || !URL_ENDPOINT) {
  console.error('Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT in the environment.');
  process.exit(1);
}

const imagekit = new ImageKit({
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  urlEndpoint: URL_ENDPOINT,
});

app.get('/api/sign-imagekit', (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    // Return publicKey as well for client convenience
    res.json({ ...authParams, publicKey: PUBLIC_KEY });
  } catch (err) {
    console.error('Error generating ImageKit auth params', err);
    res.status(500).json({ error: 'Failed to generate auth parameters' });
  }
});

app.listen(PORT, () => {
  console.log(`ImageKit signing server running on port ${PORT}`);
  console.log(`Ensure your frontend uploads to ${URL_ENDPOINT} and requests /api/sign-imagekit`);
});
