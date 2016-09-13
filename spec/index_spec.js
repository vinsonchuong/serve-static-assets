import serveStaticAssets from 'serve-static-assets';

describe('serve-static-assets', () => {
  it('works', () => {
    expect(serveStaticAssets()).toBe('Hello World!');
  });
});
