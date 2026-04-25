import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function useLanguage() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  
  // Safety check for i18n
  const currentI18nLang = i18n?.language || 'ar';
  
  const language = (lang === 'en' || lang === 'ar') ? lang : currentI18nLang;
  const isRTL = language === 'ar';

  const getPath = (path: string) => `/${language}${path === '/' ? '' : path}`;

  return {
    language,
    t,
    i18n,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    fontClass: isRTL ? 'font-body-ar' : 'font-body-en',
    headingClass: isRTL ? 'font-heading-ar' : 'font-heading-en',
    getPath,
  };
}
