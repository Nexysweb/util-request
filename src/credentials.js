import Store from './store';

const profileKey = 'profile';
const permissionsKey = 'permissions';
const localeKey = 'locale';

/**
 * [description]
 * @param  {[type]} token       [description]
 * @param  {[type]} profile     [description]
 * @param  {[type]} permissions: e.g ['permission1', 'permission2', 'permission3'] ...
 * @param  {[type]} locale      [description]
 * @return {[type]}             [description]
 */
export const set = (token, profile, permissions, locale) => {
  Store.set(profileKey, profile);
  Store.set(permissionsKey, permissions);
  Store.set(localeKey, locale);
}

export const remove = () => {
  Store.remove(profileKey);
  Store.remove(permissionsKey);
  Store.remove(localeKey);
}

export const getProfile = () => Store.get(profileKey);

export const getPermissions = () => Store.get(permissionsKey);

export const getLocale = () => Store.get(localeKey);

export const isDefined = () => !!getProfile()

export default { set, remove, getProfile, getPermissions, getLocale, isDefined };