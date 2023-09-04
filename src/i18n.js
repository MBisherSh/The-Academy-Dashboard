import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
const LANG_KEY = 'language';

const lang = localStorage.getItem(LANG_KEY) || 'en';
i18n.use(initReactI18next)
	.use(I18nextBrowserLanguageDetector)
	.init({
		resources: {
			en: {
				translation: enTranslation,
			},
			ar: {
				translation: arTranslation,
			},
		},
		lng: lang,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	})
	.then(() => {
		localStorage.setItem(LANG_KEY, lang);
	});
