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
      url: '/foo.html'
    };
    expect(await project::serveStaticAssets(request)).toBe(null);
  }))

  it('returns metadata for a given file', inject(async ({project}) => {
    await project.write({
      'foo.html': `
        <!doctype html>
        <meta charset="utf-8">
      `
    })

    const request = {
      url: '/foo.html'
    };
    const file = await project::serveStaticAssets(request);
    expect(file.path).toBe(project.path('foo.html'));
    expect(file.type).toBe('.html');
    expect(file.stats).toEqual(await project.stat('foo.html'));
    expect(await file.stream()::read()).toBe(await project.read('foo.html'));
  }));

  it('returns metadata for directory/index.html given a directory', inject(async ({project}) => {
    await project.write({
      'index.html': `
        <!doctype html>
        <meta charset="utf-8">
      `
    })

    const request = {
      url: '/'
    };
    const file = await project::serveStaticAssets(request);
    expect(file.path).toBe(project.path('index.html'));
    expect(file.type).toBe('.html');
    expect(file.stats).toEqual(await project.stat('index.html'));
    expect(await file.stream()::read()).toBe(await project.read('index.html'));
  }));
});
