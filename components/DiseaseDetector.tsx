import React, { useState, useRef, useCallback } from 'react';
import { analyzeCropImage } from '../services/geminiService';
import { DiseaseResult } from '../types';
import { LANGUAGES } from '../constants';
import { useTranslation } from '@/hooks/useTranslation';
import DiseaseResultDisplay from './DiseaseResultDisplay';
import DiseaseResultSkeleton from './DiseaseResultSkeleton';
import type { User } from 'firebase/auth';

interface DiseaseDetectorProps {
    user: User;
}

const DiseaseDetector: React.FC<DiseaseDetectorProps> = ({ user }) => {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const handleDiagnose = useCallback(async () => {
    if (!imageFile) {
      setError(t('detect.error.noImage'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // map selected display name to a plain language name the model understands
      const langEntry = LANGUAGES.find(l => l.name === language) || LANGUAGES.find(l => l.code === 'en')!;
      const codeToName: Record<string, string> = { en: 'English', ta: 'Tamil', hi: 'Hindi', te: 'Telugu' };
      const selectedLanguageName = codeToName[langEntry.code] || 'English';
      const analysisResult = await analyzeCropImage(imageFile, selectedLanguageName);
      setResult(analysisResult);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(t('detect.error.analysisError'));
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, language]);
  
  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const renderUploadForm = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-4">
            {imagePreview ? (
                <img src={imagePreview} alt="Crop preview" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
                <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>{t('detect.imagePreview')}</p>
                </div>
            )}
            </div>
            
            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                {t('detect.uploadButton')}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
        </div>

        <div className="space-y-6">
            <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">{t('detect.selectLanguage')}</label>
                <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                ))}
                </select>
            </div>

            <button
                onClick={handleDiagnose}
                disabled={!imageFile}
                className="w-full bg-brand-green text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-brand-green-dark transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {t('detect.diagnoseButton')}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </div>
    </div>
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-brand-green-dark">{t('detect.title')}</h2>
        <p className="text-gray-600 mt-2">
            {
                isLoading ? t('detect.analyzing') : 
                result ? t('detect.diagnosed') :
                t('detect.uploadPrompt')
            }
        </p>
      </div>
      
      {isLoading ? (
        <DiseaseResultSkeleton />
      ) : result ? (
        <DiseaseResultDisplay 
            result={result} 
            imagePreview={imagePreview!} 
            onReset={resetState} 
            user={user}
            imageFile={imageFile!}
        />
      ) : (
        renderUploadForm()
      )}
    </div>
  );
};

export default DiseaseDetector;