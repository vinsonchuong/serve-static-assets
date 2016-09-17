import register from 'test-inject';
import Directory from 'directory-helpers';
import serveStaticAssets from 'serve-static-assets';

async function read() {
  return await new Promise((resolve) => {
    let data = '';
    this.setEncoding('utf-8');
    this.on('data', (chunk) => {
      data += chunk;
    });
    this.on('end', () => resolve(data));
  });
}

const inject = register({
  project: {
    setUp: () => new Directory('project'),
    tearDown: async (project) => await project.remove()
  }
});

describe('serve-static-assets', () => {
  it('returns null for a file that does not exist', inject(async ({project}) => {
    const request = {
      path: 'foo.html'
    };
    expect(await serveStaticAssets(project, request)).toBe(null);
  }))

  it('returns metadata for a given file', inject(async ({project}) => {
    await project.write({
      'src/foo.html': `
        <!doctype html>
        <meta charset="utf-8">
      `
    })

    const request = {
      path: 'foo.html'
    };
    const file = await serveStaticAssets(project, request);
    expect(file.type).toBe('.html');
    expect(file.stats).toEqual(await project.stat('src/foo.html'));
    expect(await file.stream()::read())
      .toBe(await project.read('src/foo.html'));
  }));

  it('returns metadata for directory/index.html given a directory', inject(async ({project}) => {
    await project.write({
      'src/index.html': `
        <!doctype html>
        <meta charset="utf-8">
      `
    })

    const request = {
      path: ''
    };
    const file = await serveStaticAssets(project, request);
    expect(file.type).toBe('.html');
    expect(file.stats).toEqual(await project.stat('src/index.html'));
    expect(await file.stream()::read())
      .toBe(await project.read('src/index.html'));
  }));
});
