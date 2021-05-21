import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./zh.json";
import en from "./en.json";

const resources = {
  en,
  zh,
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next.
  .init({
    resources,
    lng: "en",
    keySeparator: false, // We do not use keys in the form: messages.welcome
    interpolation: {
      escapeValue: false, // React already safes from xss.
    },
  });

export default i18n;
