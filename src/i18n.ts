import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import euTranslation from './locales/eu.json';
import esTranslation from './locales/es.json';
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            eu: { translation: euTranslation },
            es: { translation: esTranslation },
            en: { translation: enTranslation },
            fr: { translation: frTranslation }
        },
        lng: 'es', // Idioma por defecto
        fallbackLng: 'eu', // Si no encuentra traducción en el idioma elegido, usa inglés
        interpolation: { escapeValue: false } // Evita escapes innecesarios
    });

export default i18n;
