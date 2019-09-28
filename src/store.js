import store from 'store';

const get = (key) => store.get(key);

const set = (key, value) => store.set(key, value);

const remove = key => store.remove(key);

export default {
  get, set, remove
}