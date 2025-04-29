import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import taTranslation from './locales/ta.json';
import teTranslation from './locales/te.json';
import bnTranslation from './locales/bn.json';
import mrTranslation from './locales/mr.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      hi: {
        translation: hiTranslation
      },
      ta: {
        translation: taTranslation
      },
      te: {
        translation: teTranslation
      },
      bn: {
        translation: bnTranslation
      },
      mr: {
        translation: mrTranslation
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n;