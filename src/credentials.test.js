import Credentials from './credentials';

const profile = {name: 'my profile'}
const token = 'my token';
const permissions = ['a', 'b', 'c'];
const locale = 'en';

test('set credentials', () => {
  Credentials.set(token, profile, permissions, locale);

  expect(Credentials.getProfile()).toEqual(profile);
  expect(Credentials.getPermissions()).toEqual(permissions);
  expect(Credentials.getLocale()).toEqual(locale);
  expect(Credentials.isDefined()).toEqual(true);
});

test('remove credentials', () => {
  Credentials.remove(token, profile, permissions, locale);

  expect(Credentials.getProfile()).toEqual(undefined);
  expect(Credentials.isDefined()).toEqual(false);
});