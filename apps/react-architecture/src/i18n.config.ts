import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { es, en } from "../locales/index"
import LanguageDetector from "i18next-browser-languagedetector"

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    //debug: true, // activate debug mode
    fallbackLng: "en",
    detection: {
      order: ["path", "subdomain", "cookie", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lang",
    },
    supportedLngs: ["es", "en"], // supported languages
    ns: ["common", "settings", "demo", "footer", "login", "error"], // namespaces
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      es: es,
      en: en,
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ["br", "strong", "i", "span"],
    },
  })
