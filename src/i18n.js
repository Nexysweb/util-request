import Polyglot from 'node-polyglot';

import Request from './request';

// global variable to be set
const localeDefault = process.env.I18N_LOCALE_DEFAULT || 'en';
const urlFetch = process.env.I18N_URL_FETCH ? process.env.I18N_URL_FETCH.replace('${locale}', localeDefault) : `/i18n/${localeDefault}/serve`;
const urlInsert = process.env.I18N_URL_INSERT || '/product/i18n/insert';

// NOTE: handle en-US
const getLanguage = code => {
  if (code.length > 2) return code.substring(0,2);
  else return code;
}

// TODO: test function
export const getBrowserLanguage = () => {
  const nav = window.navigator;
  const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];

  let i, language = null;
  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language) {
        return getLanguage(language);
      }
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language) {
      return getLanguage(language);
    }
  }

  return null;
}

const insertKeys = tuples => {
  const sets = new Set(tuples.flat());
  const args = [...processArgTuples(tuples)];
  const inserts = args.map(async (key) => {
    try {
      return await Request.post(urlInsert, { key })
    } catch (err) {
      return err.toString();
    }
  });
  return Promise.all(inserts);
}

//const insertKey = debounce(insertKeys, 2000, {accumulate: true});

const onMissingKey = (key, options, locale) => {
  // IDEA: use locale to insert, { key, (productId), values = [{ langID: locale, name: Please translate me }]
  insertKey(key)
  .catch(() => console.warn(`i18n - failed to insert key ${key}`));

  // NOTE: return key as fallback
  return key;
}

class I18n {
  wasInit = false;

  init() {
    return Request.get(urlFetch).then(res => {
      const polyglot = new Polyglot({phrases: res});
      this.translator = polyglot.t.bind(polyglot);
    });
  }

  /**
   * finds the translation for the given key
   * @param  key: key to be translated
   * @return translattion associated with `key`
   */
  translate(key) {
    if (!key) return null;
    if (!this.translator) return key;
    return this.translator(key);
  }
}

export default new I18n();