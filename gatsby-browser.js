// Include the i18n initialisation script.
import "./i18n/index";
import "./src/components/prism-coldark-dark.css";

import i18n from "i18next";

export const wrapPageElement = ({ props: { pageContext } }) => {
  if (i18n.language !== pageContext.langKey) {
    i18n.changeLanguage(pageContext.langKey);
  }
};
