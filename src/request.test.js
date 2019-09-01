import Request from './request';

const host = 'https://postman-echo.com';

test('get request', async () => {
  const url = host + '/get?foo1=bar1&foo2=bar2';

  const t = await Request.get(url);

  const args = {foo1: 'bar1', foo2: 'bar2'}

  expect(t.data.args).toEqual(args);
})

test('post request', async () => {
  const url = host + '/post';

  const args = {foo1: 'bar1', foo2: 'bar2'}

  const data = {args};

  const t = await Request.post(url, data);

  expect(t.data.json.args).toEqual(data.args)
})