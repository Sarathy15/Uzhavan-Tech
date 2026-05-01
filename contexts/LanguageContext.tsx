import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: Language[];
}

const availableLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'hi', name: 'हिंदी' }
];

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: availableLanguages[0],
  setLanguage: () => {},
  availableLanguages: availableLanguages
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred_language');
    return saved ? JSON.parse(saved) : availableLanguages[0];
  });

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred_language', JSON.stringify(lang));
    document.documentElement.lang = lang.code;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);