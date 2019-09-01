import I18n from './index'

test('test', () => {
  const key = 'mykey'
  const value = key
  expect(I18n.translate(key)).toEqual(value)
})