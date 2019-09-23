import Polyglot from 'node-polyglot';

import Request from './request';

// global variable to be set
const dirpath = process.env.I18N_DIRPATH || '../../../locales';
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
  constructor() {
    this.fetchTranslations = this.fetchTranslations.bind(this);
    this.translators = {};
    this.translator = null;

    if (process.env.STORYBOOK_GIT_ORIGIN) {
      this.initLocale('en');
    } else {
      // NOTE: check if in development mode
      this.isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (!this.isDev) {
        // NOTE: fetch english translations for base translator
        this.fetchTranslations('en');
      }
    }
  }
  
  initLocale(locale) {
    const phrases = require(`${dirpath}/${locale}.json`);
    const polyglot = new Polyglot({ locale, phrases });
    this.translator = polyglot.t.bind(polyglot);
    this.translators[locale] = this.translator;
  }

  async fetchTranslations(locale) {
    let result = null;
    if (this.isDev) {
      result = await Request.get(`/i18n/${locale}/dev`);
    } else {
      const currentTranslator = this.translators[locale];
      if (currentTranslator) {
        this.translator = currentTranslator;
        return;
      }
      
      result = await Request.get(`/i18n/${locale}/serve`);
    }

    const phrases = result.data;
    const polyglot = new Polyglot({ locale, phrases, allowMissing: !this.isDev, onMissingKey });
    // NOTE: https://github.com/airbnb/polyglot.js#options-overview
    this.translator = polyglot.t.bind(polyglot);
    this.translators[locale] = this.translator;
  }

  async changeLocale(locale) {
    try {
      await this.fetchTranslations(locale);
      this.locale = locale;
    } catch(e) { console.log('Could not change locale due to', e); }
  }

  translate(path, vars=null, tooltip=false) {
    if (!path) return null;
    if (!this.translator) return path; // <span><Loader thickness={1} radius={10} className="inline-block" /> Loading translation..</span>;
    // alternative: this.translator.has(path) ?
    let translation = this.translator(path);
    if (vars) translation = this.translator(path, vars);

    if (!this.isDev) {
      // NOTE: in production mode, translate untranslated keys to english
      if (translation === path && this.locale != 'en') {
        translation = this.translators['en'](path);
        if (vars) translation = this.translators['en'](path, vars);
      }
    }

    return translation;
  }
}

export default new I18n();
