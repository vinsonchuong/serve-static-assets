# serve-static-assets
[![Build Status](https://travis-ci.org/vinsonchuong/serve-static-assets.svg?branch=master)](https://travis-ci.org/vinsonchuong/serve-static-assets)

Serve static assets from the file system.

## Installing
`serve-static-assets` is available as an
[npm package](https://www.npmjs.com/package/serve-static-assets).

## Usage
Add `serve-bin` and `serve-static-assets` to the `package.json`.

```json
{
  "name": "project",
  "private": true,
  "scripts": {
    "build": "build"
  },
  "devDependencies": {
    "serve-bin": "^0.0.1",
    "serve-static-assets": "^0.0.1"
  }
}
```

From the command line, run:
```bash
npm start
```

`serve-static-assets` will serve files relative to the `src` directory.

## Development
### Getting Started
The application requires the following external dependencies:
* Node.js

The rest of the dependencies are handled through:
```bash
npm install
```

Run tests with:
```bash
npm test
```
