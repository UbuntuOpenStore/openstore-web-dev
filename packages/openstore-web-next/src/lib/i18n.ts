import i18next from "i18next";

// Only using the ones that have >75% translations
import ar from "../locales/ar.json";
import be from "../locales/be.json";
import ca from "../locales/ca.json";
import cs from "../locales/cs.json";
import de from "../locales/de.json";
import el from "../locales/el.json";
import es from "../locales/es.json";
import fi from "../locales/fi.json";
import fr from "../locales/fr.json";
import gl from "../locales/gl.json";
import he from "../locales/he.json";
import hu from "../locales/hu.json";
import it from "../locales/it.json";
import lt from "../locales/lt.json";
import nb_NO from "../locales/nb_NO.json";
import nl from "../locales/nl.json";
import pl from "../locales/pl.json";
import pt_BR from "../locales/pt_BR.json";
import pt from "../locales/pt.json";
import pt_PT from "../locales/pt_PT.json";
import ru from "../locales/ru.json";
import sc from "../locales/sc.json";
import sk from "../locales/sk.json";
import sv from "../locales/sv.json";
import ta from "../locales/ta.json";
import tr from "../locales/tr.json";
import ug from "../locales/ug.json";
import zh_Hant from "../locales/zh_Hant.json";
import zh_Hans from "../locales/zh_Hans.json";

export const languages = {
  en_US: 'English',

  ar: "Arabic",
  be: "Belarusian",
  ca: "Catalan",
  cs: "Czech",
  de: "German",
  el: "Greek",
  es: "Spanish",
  fi: "Finnish",
  fr: "French",
  gl: "Galician",
  he: "Hebrew",
  hu: "Hungarian",
  it: "Italian",
  lt: "Lithuanian",
  nb_NO: "Norwegian Bokmål",
  nl: "Dutch",
  pl: "Polish",
  pt_BR: 'Portuguese (Brazil)',
  pt_PT: "Portuguese (Portugal)",
  pt: "Portuguese",
  ru: "Russian",
  sc: "Sardinian",
  sk: "Slovak",
  sv: "Swedish",
  ta: "Tamil",
  tr: "Turkish",
  zh_Hans: "Chinese (Simplified)",
  zh_Hant: "Chinese (Traditional)",
};

export async function initializeI18N(lang: keyof typeof languages) {
  return i18next.init({
    lng: lang,
    resources: {
      ar: { translation: ar },
      be: { translation: be },
      ca: { translation: ca },
      cs: { translation: cs },
      de: { translation: de },
      el: { translation: el },
      es: { translation: es },
      fi: { translation: fi },
      fr: { translation: fr },
      gl: { translation: gl },
      he: { translation: he },
      hu: { translation: hu },
      it: { translation: it },
      lt: { translation: lt },
      nb_NO: { translation: nb_NO },
      nl: { translation: nl },
      pl: { translation: pl },
      pt: { translation: pt },
      pt_BR: { translation: pt_BR },
      pt_PT: { translation: pt_PT },
      ru: { translation: ru },
      sc: { translation: sc },
      sk: { translation: sk },
      sv: { translation: sv },
      ta: { translation: ta },
      tr: { translation: tr },
      ug: { translation: ug },
      zh_Hant: { translation: zh_Hant },
      zh_Hans: { translation: zh_Hans },
    },

    // Use the key as the fallback
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: false,
  });
}
