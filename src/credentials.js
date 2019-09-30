const authKey = 'auth';
const profileKey = 'profile';
const permissionsKey = 'permissions';
const localeKey = 'locale';

export const storeCredentials = (token, profile, permissions, locale) => {
  Cookies.set(authKey, { token });
  Store.set(profileKey, profile);
  Store.set(permissionsKey, permissions);
  Store.set(localeKey, locale);
}

export const removeCredentials = () => {
  Cookies.remove(authKey);
  Store.remove(profileKey);
  Store.remove(permissionsKey);
  Store.remove(localeKey);
}

export const getProfile = () => Store.get(profileKey);

export const getPermissions = () => Store.get(permissionsKey);

export const getLocale = () => Store.get(localeKey);

export default { getProfile, getPermissions, getLocale };