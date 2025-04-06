import i18next from "i18next";

// TODO only include languages that have > X% coverage
import ar from "../locales/ar.json";
import ast from "../locales/ast.json";
import be from "../locales/be.json";
import ber from "../locales/ber.json";
import ca from "../locales/ca.json";
import cmn from "../locales/cmn.json";
import cs from "../locales/cs.json";
import da from "../locales/da.json";
import de from "../locales/de.json";
import el from "../locales/el.json";
import en_GB from "../locales/en_GB.json";
import eo from "../locales/eo.json";
import es from "../locales/es.json";
import eu from "../locales/eu.json";
import fa from "../locales/fa.json";
import fi from "../locales/fi.json";
import fr from "../locales/fr.json";
import gl from "../locales/gl.json";
import gu from "../locales/gu.json";
import he from "../locales/he.json";
import hu from "../locales/hu.json";
import it from "../locales/it.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import lt from "../locales/lt.json";
import ml from "../locales/ml.json";
import nb_NO from "../locales/nb_NO.json";
import nl from "../locales/nl.json";
import pl from "../locales/pl.json";
import pt_BR from "../locales/pt_BR.json";
import pt from "../locales/pt.json";
import pt_PT from "../locales/pt_PT.json";
import ro from "../locales/ro.json";
import ru from "../locales/ru.json";
import sc from "../locales/sc.json";
import si from "../locales/si.json";
import sk from "../locales/sk.json";
import sq from "../locales/sq.json";
import sr from "../locales/sr.json";
import sv from "../locales/sv.json";
import th from "../locales/th.json";
import tr from "../locales/tr.json";
import ug from "../locales/ug.json";
import zh_Hant_HK from "../locales/zh_Hant_HK.json";
import zh_Hant from "../locales/zh_Hant.json";

export const languages = {
  en_US: 'English',

  // TODO update list
  ar: 'Arabic',
  ast: 'Asturian',
  ca: 'Catalan',
  cs: 'Czech',
  de: 'German',
  en_GB: 'English (UK)',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  nb_NO: 'Norwegian Bokmål',
  nl: 'Dutch',
  pl: 'Polish',
  pt_PT: 'Portuguese',
  ru: 'Russian',
  sr: 'Serbian',
  sv: 'Swedish',
  tr: 'Turkish',
  zh_Hant: 'Chinese (Traditional)',
};

export async function initializeI18N(lang: keyof typeof languages) {
  return i18next.init({
    lng: lang,
    resources: {
      ar: { translation: ar },
      ast: { translation: ast },
      be: { translation: be },
      ber: { translation: ber },
      ca: { translation: ca },
      cmn: { translation: cmn },
      cs: { translation: cs },
      da: { translation: da },
      de: { translation: de },
      el: { translation: el },
      en_GB: { translation: en_GB },
      eo: { translation: eo },
      es: { translation: es },
      eu: { translation: eu },
      fa: { translation: fa },
      fi: { translation: fi },
      fr: { translation: fr },
      gl: { translation: gl },
      gu: { translation: gu },
      he: { translation: he },
      hu: { translation: hu },
      it: { translation: it },
      ja: { translation: ja },
      ko: { translation: ko },
      lt: { translation: lt },
      ml: { translation: ml },
      nb_NO: { translation: nb_NO },
      nl: { translation: nl },
      pl: { translation: pl },
      pt: { translation: pt },
      pt_BR: { translation: pt_BR },
      pt_PT: { translation: pt_PT },
      ro: { translation: ro },
      ru: { translation: ru },
      sc: { translation: sc },
      si: { translation: si },
      sk: { translation: sk },
      sq: { translation: sq },
      sr: { translation: sr },
      sv: { translation: sv },
      th: { translation: th },
      tr: { translation: tr },
      ug: { translation: ug },
      zh_Hant: { translation: zh_Hant },
      zh_Hant_HK: { translation: zh_Hant_HK },
    },

    // Use the key as the fallback
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: false,
  });
}
