import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage.code];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t, language: currentLanguage.code };
};