import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../assets/locales/en/translation.json';
import translationUA from '../assets/locales/ua/translation.json';
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from 'js-cookie';

const resources = {
    en: {
        translation: translationEN,
    },
    ua: {
        translation: translationUA,
    },
};

const userLanguage = Cookies.get('i18next') || 'en';

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        supportedLngs: ['en', 'ua'],
        lng: userLanguage, // Set the default language
        interpolation: {
            escapeValue: false, // React already escapes values by default
        },
        detection: {
            order: ['path', 'htmlTag', 'cookie', 'localStorage', 'subdomain'],
            caches: ['cookie'],
        },
        backend: {
            loadPath: '/assets/locales/{{lng}}/translation.json',
        }
    });

export default i18n;