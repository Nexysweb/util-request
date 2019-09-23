import Request from './request';
import { response, get, post, fetch } from './request';

const host = 'https://postman-echo.com';

/*
test('get request', async () => {
  const url = host + '/get?foo1=bar1&foo2=bar2';

  const t = await Request.get(url);

  const args = {foo1: 'bar1', foo2: 'bar2'}

  expect(t.args).toEqual(args);
})

test('post request', async () => {
  const url = host + '/post';

  const args = {foo1: 'bar1', foo2: 'bar2'}

  const data = {args};

  const t = await Request.post(url, data);

  expect(t.json.args).toEqual(data.args)
})*/



test('get response', async () => {
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

test('get response 2', async () => {

  const url = host + '/get?foo1=bar1&foo2=bar2';
  const args = {foo1: 'bar1', foo2: 'bar2'}

  const r = await get(url);

  expect(r.data.args).toEqual(args);
  expect(r.status).toEqual(200);
});

test('post response', async () => {
  const method = 'post';
  const url = host + '/post';
  const args = {foo1: 'bar1', foo2: 'bar2'}
  const data = {args};
  const responseType = 'json';
  const options = {
    method,
    url,
    data,
    responseType
  };

  const r = await response(options);

  expect(r.data.data.args).toEqual(args);
  expect(r.status).toEqual(200);
});

test('post response 2', async () => {

  const url = host + '/post';
  const args = {foo1: 'bar1', foo2: 'bar2'}
  const data = {args};

  const r = await post(url, data);

  expect(r.data.data).toEqual(data);
  expect(r.status).toEqual(200);
});

test('get response with fetch', async () => {

  const url = host + '/get?foo1=bar1&foo2=bar2';
  const args = {foo1: 'bar1', foo2: 'bar2'}

  const r = await fetch(url);

  expect(r.data.args).toEqual(args);
  expect(r.status).toEqual(200);
});

test('post response with fetch', async () => {

  const url = host + '/post';
  const args = {foo1: 'bar1', foo2: 'bar2'}
  const data = {args};

  const r = await fetch(url, data);

  expect(r.data.data).toEqual(data);
  expect(r.status).toEqual(200);
});
