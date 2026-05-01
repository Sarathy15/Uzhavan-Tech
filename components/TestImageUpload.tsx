import React, { useState } from 'react';
import { uploadImage } from '@/services/imagekitService';

const TestImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResultUrl(null);
    setError(null);
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) return setError('Please pick a file first');
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setResultUrl(url);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white max-w-md">
      <h3 className="font-medium mb-2">Test ImageKit Upload</h3>
      <input type="file" accept="image/*" onChange={onFileChange} />
      <div className="mt-3">
        <button
          onClick={onUpload}
          disabled={uploading || !file}
          className="px-3 py-1 bg-brand hover:opacity-90 text-white rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      {resultUrl && (
        <div className="mt-3 text-sm">
          <div className="font-semibold">Uploaded URL</div>
          <a href={resultUrl} target="_blank" rel="noreferrer" className="text-blue-600 break-all">{resultUrl}</a>
        </div>
      )}
      {error && (
        <div className="mt-3 text-sm text-red-600">Error: {error}</div>
      )}
    </div>
  );
};

export default TestImageUpload;
