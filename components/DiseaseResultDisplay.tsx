import React, { useState, useCallback } from 'react';
import { DiseaseResult } from '../types';
import type { User } from 'firebase/auth';
import { saveDiagnosis } from '../services/firebase';
import { uploadImage } from '../services/imagekitService';
import { useTranslation } from '@/hooks/useTranslation';

interface DiseaseResultDisplayProps {
  result: DiseaseResult;
  imagePreview: string;
  onReset: () => void;
  user: User;
  imageFile: File;
}

const DiseaseResultDisplay: React.FC<DiseaseResultDisplayProps> = ({ result, imagePreview, onReset, user, imageFile }) => {
    const { t, language } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

    const speakAdvice = useCallback(() => {
    if (typeof window.speechSynthesis === 'undefined') {
      alert(t('detect.result.speakError'));
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
        const { treatment_plan, preventive_measures } = result;
        const textToSpeak = `
                ${treatment_plan.title}. ${treatment_plan.steps.join('. ')}. ${preventive_measures.title}. ${preventive_measures.steps.join('. ')}.
        `;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        // Choose locale based on app language; fallback to en-IN
            const langMap: Record<string, string> = {
                en: 'en-IN',
                ta: 'ta-IN',
                hi: 'hi-IN',
                te: 'te-IN'
            };
            const locale = langMap[(language as string) || 'en'] || 'en-IN';
        utterance.lang = locale;

        // Attempt to select a matching voice for the locale
        const pickVoice = () => {
            const voices = window.speechSynthesis.getVoices() || [];
            if (voices.length === 0) return null;
            // exact match
            const exact = voices.find((v: SpeechSynthesisVoice) => v.lang.toLowerCase() === locale.toLowerCase());
            if (exact) return exact;
            const primary = locale.split('-')[0];
            const primaryMatch = voices.find((v: SpeechSynthesisVoice) => v.lang.toLowerCase().startsWith(primary));
            if (primaryMatch) return primaryMatch;
            // fallback to any non-empty voice
            return voices[0];
        };

        let chosenVoice = pickVoice();
        // Slightly slower rate for clarity
        utterance.rate = 0.95;
        if (chosenVoice) {
            utterance.voice = chosenVoice;
            window.speechSynthesis.speak(utterance);
        } else {
            // voices may not be loaded yet; wait for onvoiceschanged once and then speak
            const onVoicesChanged = () => {
                const v = pickVoice();
                if (v) utterance.voice = v;
                window.speechSynthesis.speak(utterance);
                window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
            };
            window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
        }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);

  }, [isSpeaking, result]);

  const handleSaveDiagnosis = async () => {
      setIsSaving(true);
      setSaveError(null);

      try {
          // Step 1: Upload image to ImageKit.io
          const imageUrl = await uploadImage(imageFile);
          
          // Step 2: Save diagnosis data with the image URL to Firestore
          await saveDiagnosis(user.uid, imageUrl, result);
          
          setIsSaved(true);
      } catch (err) {
          console.error("Error saving diagnosis:", err);
          // Show a helpful error message when available
          const msg = err instanceof Error ? err.message : JSON.stringify(err);
          setSaveError(msg || t('detect.result.saveError'));
      } finally {
          setIsSaving(false);
      }
  };

  const handleReset = () => {
    setIsSaved(false);
    setSaveError(null);
    setIsSpeaking(false);
    window.speechSynthesis.cancel();
    onReset();
  };


  const confidenceColor = result.confidence > 0.8 ? 'text-green-600' : result.confidence > 0.5 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-brand-green-dark">Diagnosis Result</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
                <img src={imagePreview} alt="Analyzed crop" className="rounded-lg shadow-md max-h-80 object-contain" />
                <div className="mt-4 text-center">
                    <p className="text-xl font-bold">{result.disease_name}</p>
                    <p className={`font-semibold ${confidenceColor}`}>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                </div>
            </div>
            <div className="space-y-6">
                 <div>
                    <button onClick={speakAdvice} className="w-full flex items-center justify-center gap-2 bg-brand-yellow text-brand-brown font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                         {isSpeaking ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h6M9 14h1"></path></svg>
                                          {t('detect.result.stopListening')}
                            </>
                         ) : (
                            <>
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0a5 5 0 017.072 0"></path></svg>
                                          {t('detect.result.listenButton')}
                            </>
                         )}
                    </button>
                </div>
                 <div>
                    <button 
                        onClick={handleSaveDiagnosis}
                        disabled={isSaving || isSaved}
                        className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-green-dark transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>
                        ) : isSaved ? '✓ Saved Successfully!' : '💾 Save Diagnosis'}
                    </button>
                                        {saveError && (
                                            <div className="mt-2 text-center">
                                                <p className="text-red-500 text-sm">{saveError}</p>
                                                <button onClick={handleSaveDiagnosis} className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-brand-yellow text-brand-brown rounded-md text-sm font-medium">Retry</button>
                                            </div>
                                        )}
                 </div>

                <InfoSection title={result.treatment_plan.title} items={result.treatment_plan.steps} icon="💊" />
                <InfoSection title={result.preventive_measures.title} items={result.preventive_measures.steps} icon="🛡️" />
            </div>
        </div>
        <div className="mt-8 text-center">
            <button onClick={handleReset} className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                {t('detect.result.analyzeAnother')}
            </button>
        </div>
    </div>
  );
};

interface InfoSectionProps {
    title: string;
    items: string[];
    icon: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, items, icon }) => (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="text-lg font-bold text-brand-green-dark mb-2">{icon} {title}</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);

export default DiseaseResultDisplay;
