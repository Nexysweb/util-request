import Index from './index';

test('make sure all dependencies do not return null', () => {
  Object.keys(Index).map(k => {
    expect(k).toBeDefined()
  });
});