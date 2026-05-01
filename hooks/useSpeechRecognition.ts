import { useEffect, useRef, useState } from 'react';

type Result = {
  interim: string;
  final: string;
};

export const useSpeechRecognition = () => {
  const recognitionRef = useRef<any | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result>({ interim: '', final: '' });
  const finalRef = useRef<string>('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const start = (lang = 'en-IN') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    setError(null);
  setResult({ interim: '', final: '' });
  finalRef.current = '';

    const recog = new SpeechRecognition();
    recognitionRef.current = recog;
    recog.lang = lang;
    recog.interimResults = true;
    recog.continuous = true;

    recog.onstart = () => {
      setIsListening(true);
    };

    recog.onerror = (ev: any) => {
      // permission denied is commonly 'NotAllowedError'
      const name = ev?.error || ev?.name || 'error';
      setError(String(name));
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
    };

    recog.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          final += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      // Append new final transcripts to the running finalRef to avoid duplicates
      if (final) {
        finalRef.current = (finalRef.current || '') + final;
      }
      setResult({ interim, final: finalRef.current });
    };

    try {
      recog.start();
    } catch (e: any) {
      // start can throw if called twice
      setError(String(e?.message || e));
    }
  };

  const stop = () => {
    const recog = recognitionRef.current;
    if (recog) {
      try {
        recog.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  return {
    isSupported,
    isListening,
    error,
    result,
    start,
    stop,
  } as const;
};

export default useSpeechRecognition;
