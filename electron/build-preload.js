const { build } = require('esbuild');
const path = require('path');

build({
  entryPoints: [path.join(__dirname, 'preload.ts')],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: path.join(__dirname, 'preload.js'),
  external: ['electron'],
}).catch(() => process.exit(1)); 