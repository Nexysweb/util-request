import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import debounce from 'debounce-promise';

import Polyglot from 'node-polyglot';

const HTTPClient = {
  get: async () => null,
  post: async () => null
}


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

const codeMap = {
  "ENG": "ENU",
  "FRA": "FRA",
  "DEU": "DEU",
  "ITA": "ITA",
  "SPA": "ESP",
  "RUS": "RUS",
  "POR": "PTG",
  "JPN": "JPN",
  "ZHO": "CHS",
  "KOR": "KOR",
  "IND": "IND"
};

export const getIBMCode = (id, languages) => {
  const language = languages.find(item => item.id === id);
  if (language && language.iso3) return codeMap[language.iso3.toUpperCase()];
  else return '';
}

// TODO: call properNames
export const originalNames = arr => {
 return arr.map(l => ({id: l.id, name: l.originalName}));
}

export const translateNames = arr => {
  return arr.map(l => ({...l, name: i18nSingleton.translate(`lang.${l.name}`)})); 
}

const processArgTuples = tuples => new Set(tuples.flat());

const insertKeys = tuples => {
  const args = [...processArgTuples(tuples)];
  const inserts = args.map(async (key) => {
    try {
      return await HTTPClient.post('/product/i18n/insert', { key })
    } catch (err) {
      return err.toString();
    }
  });
  return Promise.all(inserts);
}

const insertKey = debounce(insertKeys, 2000, {accumulate: true});

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
    const dirpath = process.env.I18N_DIRPATH || '../../../locales';
    const phrases = require(`${dirpath}/${locale}.json`);
    const polyglot = new Polyglot({ locale, phrases });
    this.translator = polyglot.t.bind(polyglot);
    this.translators[locale] = this.translator;
  }

  async fetchTranslations(locale) {
    let result = null;
    if (this.isDev) {
      result = await HTTPClient.get(`/i18n/${locale}/dev`);
    } else {
      const currentTranslator = this.translators[locale];
      if (currentTranslator) {
        this.translator = currentTranslator;
        return;
      }
      
      result = await HTTPClient.get(`/i18n/${locale}/serve`);
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

const i18nSingleton = new I18n();
export default i18nSingleton;


export class I18nProvider extends Component {
  getChildContext() {
    // phrases: require('../../../locales/en.json')
    const { locale = 'en', phrases = {}} = this.props;
    const polyglot = new Polyglot({ locale, phrases });

    const translate = polyglot.t.bind(polyglot);
    // NOTE: The bind() method creates a new function that, when called, has its this keyword set to the provided value,
    // with a given sequence of arguments preceding any provided when the new function is called
    return { locale, translate };
  }

  render() {
    return Children.only(this.props.children); 
    // NOTE: Verifies that children has only one child (a React element) and returns it.
    // Otherwise this method throws an error.
  }
}

I18nProvider.childContextTypes = {
  locale: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => state.locale;
export const ConnectedI18nProvider = connect(mapStateToProps, null)(I18nProvider);