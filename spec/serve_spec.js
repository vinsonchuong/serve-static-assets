import register from 'test-inject';
import Directory from 'directory-helpers';
import fetch from 'node-fetch';

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const inject = register({
  project: {
    setUp: () => new Directory('project'),
    tearDown: async (project) => {
      if ('server' in project) {
        const serverPid = await project.exec('pgrep', ['-f', 'node.*serve$']);
        await project.exec('kill', [serverPid]);
        await sleep(1000);
      }
      await project.remove();
    }
  }
});

async function start() {
  this.server = this.spawn('npm', ['start']);
  this.server.forEach((output) => {
    process.stderr.write(output);
  });
  await this.server.filter((output) => output.match(/Listening/));
}

async function writeBoilerplate() {
  await this.write({
    'package.json': {
      name: 'project',
      private: true,
      scripts: {
        start: 'serve'
      }
    }
  });
  await this.symlink('../node_modules', 'node_modules');
}

async function assertResponse(response, {status, headers = {}, body}) {
  if (status) {
    expect(response.status).toEqual(status);
  }
  for (const [name, value] of Object.entries(headers)) {
    expect(response.headers.get(name)).toEqual(value);
  }
  if (typeof body !== 'undefined') {
    expect(await response.text()).toEqual(body);
  }
}

describe('serve-bin', () => {
  it('serves static assets with correct headers', inject(async ({project}) => {
    await project::writeBoilerplate();
    await project.write({
      'src/index.html': `
        <!doctype html>
        <meta charset="utf-8">
      `,
      'src/app.js': `
        console.log('Hello World!');
      `,
      'src/image.png': ''
    });
    await project::start();

    await assertResponse(
      await fetch('http://localhost:8080'),
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=0',
          'ETag': jasmine.stringMatching(/^W\/".*"$/),
          'Last-Modified': jasmine.stringMatching(
            new Date().toUTCString().slice(0, -6)),
          'Content-Type': 'text/html; charset=utf-8'
        },
        body: await project.read('src/index.html')
      }
    );

    await assertResponse(
      await fetch('http://localhost:8080/app.js'),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8'
        },
        body: await project.read('src/app.js')
      }
    );

    await assertResponse(
      await fetch('http://localhost:8080/image.png'),
      {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': '1'
        }
      }
    );
  }));
});
