import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./assets/languages/en/translation.json";
import tr from "./assets/languages/tr/translation.json";
import de from "./assets/languages/de/translation.json";
import * as Locale from "expo-localization";

Locale.getLocales()[0].languageCode;

i18n.use(initReactI18next).init({
	lng: Locale.getLocales()[0].languageCode || "en",
	fallbackLng: "en",
	debug: true,
	defaultNS: "common",
	fallbackNS: "common",
	keySeparator: ".",
	interpolation: {
		escapeValue: false,
		formatSeparator: ",",
	},
	react: {
		bindI18n: "languageChanged loaded",
		nsMode: "default",
		useSuspense: true,
	},
	compatibilityJSON: "v3",
	resources: {
		en: {
			common: en,
		},
		tr: {
			common: tr,
		},
		de: {
			common: de,
		},
	},
});

export default i18n;
