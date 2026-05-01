// =================================================================================================
// IMPORTANT: ImageKit.io CONFIGURATION
// =================================================================================================
//
// PLEASE REPLACE THE PLACEHOLDER VALUES BELOW WITH YOUR ACTUAL ImageKit.io PROJECT DETAILS.
//
// You can find these details in your ImageKit.io dashboard under "Developer -> API Keys".
//
// For production use, it is STRONGLY RECOMMENDED to use a signed upload. This involves
// creating a secure backend endpoint on your server to generate a unique token and signature
// for each upload, preventing unauthorized use of your ImageKit account.
//
// Learn more: https://docs.imagekit.io/api-reference/upload-api/client-side-file-upload
//
// =================================================================================================

// Only the public key and URL endpoint are required on the client.
// Do NOT expose `IMAGEKIT_PRIVATE_KEY` in a public client for production.
// For production, implement signed uploads server-side and do not include the private key in the client bundle.
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT) {
    throw new Error("ImageKit configuration is missing (public key or URL endpoint). Please check your .env file.");
}


/**
 * Uploads an image file to ImageKit.io using an unsigned request.
 * @param imageFile The image file to upload.
 * @returns A promise that resolves to the public URL of the uploaded image.
 */
export const uploadImage = async (imageFile: File): Promise<string> => {
    if (!IMAGEKIT_PUBLIC_KEY) {
        throw new Error("ImageKit public key is not configured. Please check services/imagekitService.ts");
    }
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('fileName', imageFile.name);

    // Add metadata and organize into folders
    formData.append('tags', 'crop-disease,diagnosis');
    formData.append('folder', `/crop-images/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}`);
    formData.append('useUniqueFileName', 'true');

    // Use CORS mode and provide better error messages for debugging
    // Attempt to request signed auth params from local signing endpoint
    try {
        const signerRes = await fetch('/api/sign-imagekit');
        if (signerRes.ok) {
            const auth = await signerRes.json();
            // attach required auth params for signed upload
            if (auth.signature) formData.append('signature', auth.signature);
            if (auth.token) formData.append('token', auth.token);
            if (auth.expire) formData.append('expire', String(auth.expire));
            if (auth.publicKey) formData.append('publicKey', auth.publicKey);
        } else {
            // Fallback: try unsigned upload with public key (if provided)
            if (IMAGEKIT_PUBLIC_KEY) formData.append('publicKey', IMAGEKIT_PUBLIC_KEY as string);
        }

        const response = await fetch(IMAGEKIT_URL_ENDPOINT as string, {
            method: 'POST',
            body: formData,
            mode: 'cors',
        });

        if (!response.ok) {
            let errorText = '';
            try {
                const json = await response.json();
                errorText = json.message || JSON.stringify(json);
            } catch (e) {
                errorText = await response.text().catch(() => 'Unknown error body');
            }
            throw new Error(`ImageKit upload failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        if (!result || !result.url) throw new Error('ImageKit upload succeeded but response did not include a URL');
        return result.url;
    } catch (err: any) {
        // Normalize network errors to include helpful guidance
        const message = err?.message || String(err);
        console.error('ImageKit upload error:', message);
        throw new Error(`ImageKit upload failed (network/CORS or invalid endpoint). ${message}`);
    }
};
