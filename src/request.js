// https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
// todo: link with toast and redux
import axios from 'axios';

/**
 * wrapper around main axios functin (in case we decide to change the library)
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export const response = options => axios(options);

// default parameters 
const withCredentials = true;
const responseType = 'json';

const defaultParameters = {
  withCredentials, responseType
}

/**
 * get request
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
export const get = url => {
  const method = 'get';

  const options = {
    method,
    url,
    ...defaultParameters
  };

  return response(options).then( formatSuccess, formatError );
}

/**
 * post request
 * @param  {[type]} url  [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const post = (url, data) => {
  const method = 'post';

  const options = {
    method,
    url,
    data,
    ...defaultParameters
  };

  return response(options).then( formatSuccess, formatError );
}

const formatSuccess = x => x.data;

const formatError = x => Promise.reject({
  status: x.response.status,
  data: x.response.data
});

/**
 * get/post request depending on whether `data` is available
 * @param  {[type]} url  [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const fetch = (url, data = null) => {
  if (data === null || !data) {
    // get request
    return get(url);
  }

  return post(url, data);
}

export default { response, get, post, fetch };
