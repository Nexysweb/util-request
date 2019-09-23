import I18n from './i18n'

import { getBrowserLanguage } from './i18n';

test('test translate', () => {
  const key = 'mykey'
  const value = key
  expect(I18n.translate(key)).toEqual(value)
});

test('getBrowserLanguage', () => {
  const value = 'en';
  expect(getBrowserLanguage()).toEqual(value)
});