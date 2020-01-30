/**
 * @jest-environment node
 */
// @see https://github.com/axios/axios/issues/1754
import Request from './request';
import { response, get, post, fetch,fetchWithNotifications, mapStatusToMessage } from './request';

const host = 'https://postman-echo.com';


test('get request', async () => {
  const url = host + '/get?foo1=bar1&foo2=bar2';

  const t = await Request.get(url);

  const args = {foo1: 'bar1', foo2: 'bar2'}

  expect(t.args).toEqual(args);
});

test('post request', async () => {
  const url = host + '/post';

  const args = {foo1: 'bar1', foo2: 'bar2'}

  const data = {args};

  const t = await Request.post(url, data);

  expect(t.json.args).toEqual(data.args)
});

test('get response (general)', async () => {
  const method = 'get';
  const url = host + '/get?foo1=bar1&foo2=bar2';
  const args = {foo1: 'bar1', foo2: 'bar2'}

  const responseType = 'json';
  const options = {
    method,
    url,
    responseType
  };

  const r = await response(options);

  expect(r.data.args).toEqual(args);
  expect(r.status).toEqual(200);
});

test('post response (general)', async () => {
  const method = 'post';
  const url = host + '/post';

  const data = {foo1: 'bar1', foo2: 'bar2'}
  const responseType = 'json';
  const options = {
    method,
    url,
    data,
    responseType
  };

  const r = await response(options);

  expect(r.data.data).toEqual(data);
  expect(r.status).toEqual(200);
});

test('get response - helper', async () => {

  const url = host + '/get?foo1=bar1&foo2=bar2';
  const args = {foo1: 'bar1', foo2: 'bar2'}

  const r = await get(url);

  expect(r.args).toEqual(args);
});

test('post response - helper', async () => {
  const url = host + '/post';
  const args = {foo1: 'bar1', foo2: 'bar2'}
  const data = {args};

  const r = await post(url, data);

  expect(r.data).toEqual(data);
  // expect(r.status).toEqual(200);
});

test('get response with fetch', async () => {
  const url = host + '/get?foo1=bar1&foo2=bar2';
  const args = {foo1: 'bar1', foo2: 'bar2'}

  const r = await fetch(url);

  expect(r.args).toEqual(args);
});

test('post response with fetch', async () => {
  const url = host + '/post';
  const args = {foo1: 'bar1', foo2: 'bar2'}
  const data = {args};

  const r = await fetch(url, data);

  expect(r.data).toEqual(data);
});

test('map status to message', () => {
  expect(mapStatusToMessage(500)).toEqual('growl.serverError.danger');
})

test('get response with fetch with notifications', async () => {
  const url = host + '/get?foo1=bar1&foo2=bar2';
  const args = {foo1: 'bar1', foo2: 'bar2'}

  const r = await fetchWithNotifications(url);

  expect(r.data.args).toEqual(args);
  expect(r.message).toEqual('growlAlert.text.save.success')
});

test('get response 400 with notification', async () => {
  const url = host + '/status/400?foo1=bar1&foo2=bar2';
  const args = {foo1: 'bar1', foo2: 'bar2'}

  const r = await fetchWithNotifications(url);
  
  expect(r.data).toEqual({"status":400});
  expect(r.message).toEqual(null)
});
