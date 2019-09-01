// todo rework and have in a separate package

import axios from 'axios';

// TODO: wrap fetch https://devhints.io/js-fetch
// TODO: rename to Request(Service)
class RequestService {
  constructor() {
    this.axios = axios.create();
  }

  // standard HTTP methods
  get = (uri) => {
    return this.axios.get(uri).then(x => x.data);
  }

  post = (uri, data, auth) => {
    return this.axios.post(uri, data, { auth }).then(x => x.data);
  }
}

const RequestSingleton = new RequestService();
export default RequestSingleton;