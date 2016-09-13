import {childProcess} from 'node-promise-es6';

describe('serve-static-assets', () => {
  it('outputs "3...2...1...Hello World!"', async () => {
    const {stdout} = await childProcess.exec('serve-static-assets');
    expect(stdout.trim()).toBe('3...2...1...Hello World!');
  });
});
