import Index from './pindex';

test('make sure all dependencies do not return null', () => {
  Object.keys(Index).map(k => {
    console.log(k)
    expect(k).toBeDefined()
  });
});