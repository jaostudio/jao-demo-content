const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packagesDir = path.join(root, 'packages');

function getPackages() {
  return fs.readdirSync(packagesDir).filter(d =>
    fs.statSync(path.join(packagesDir, d)).isDirectory()
  );
}

function resolveWildcard(globPath, srcDir) {
  const baseGlob = globPath.replace(/^\.\//, '').replace(/\*$/, '');
  const fullDir = path.join(srcDir, baseGlob);
  if (!fs.existsSync(fullDir)) return [];
  const entries = [];
  const files = fs.readdirSync(fullDir, { withFileTypes: true });
  for (const f of files) {
    if (f.isFile() && (f.name.endsWith('.ts') || f.name.endsWith('.tsx') || f.name.endsWith('.mjs'))) {
      entries.push(path.join(baseGlob, f.name).replace(/\\/g, '/'));
    }
  }
  return entries;
}

for (const pkgName of getPackages()) {
  const pkgDir = path.join(packagesDir, pkgName);
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

  if (pkgName === 'config') {
    console.log(`[${pkgName}] Skipping (no build needed)`);
    continue;
  }

  // --- Step 1: Process exports into entry map and built exports ---
  const exports = pkgJson.exports || {};
  const builtExports = {};
  const entryMap = {};
  let hasEntries = false;

  for (const [exportKey, exportValue] of Object.entries(exports)) {
    const sourcePath = typeof exportValue === 'string' ? exportValue : exportValue.default || exportValue.import;
    if (!sourcePath) continue;
    const srcRelative = sourcePath.replace(/^\.\//, '');

    if (srcRelative.endsWith('*')) {
      const files = resolveWildcard(sourcePath, pkgDir);
      for (const file of files) {
        const filePath = file.replace(/\.(ts|tsx|mjs)$/, '');
        const exportSubpath = filePath.replace(/^src\//, '');
        entryMap[exportSubpath] = path.join(pkgDir, file);
        builtExports['./' + exportSubpath] = './dist/' + exportSubpath + '.js';
        hasEntries = true;
      }
      continue;
    }

    const outPath = srcRelative.replace(/^src\//, '').replace(/\.(ts|tsx|mjs)$/, '');
    entryMap[outPath] = path.join(pkgDir, sourcePath.replace(/^\.\//, ''));
    builtExports[exportKey] = {
      types: `./dist/${outPath}.d.ts`,
      import: `./dist/${outPath}.js`,
    };
    hasEntries = true;
  }

  if (!hasEntries) {
    console.log(`[${pkgName}] No export entries found`);
    continue;
  }

  // --- Step 2: Fix peerDependencies (before tsup config) ---
  if (pkgName === 'core' || pkgName === 'analytics') {
    if (!pkgJson.peerDependencies) pkgJson.peerDependencies = {};
    if (!pkgJson.peerDependencies.react) {
      pkgJson.peerDependencies.react = '^19.0.0';
      console.log(`[${pkgName}] Added react to peerDependencies`);
    }
    if (!pkgJson.peerDependencies['react-dom']) {
      pkgJson.peerDependencies['react-dom'] = '^19.0.0';
      console.log(`[${pkgName}] Added react-dom to peerDependencies`);
    }
  }

  if (pkgName === 'ui') {
    if (!pkgJson.peerDependencies) pkgJson.peerDependencies = {};
    if (!pkgJson.peerDependencies['@jaostudio/engine']) {
      pkgJson.peerDependencies['@jaostudio/engine'] = '^0.2.0';
      console.log(`[${pkgName}] Added @jaostudio/engine to peerDependencies`);
    }
  }

  // --- Step 3: Build tsup config with correct external list ---
  const tsupEntries = {};
  for (const [outPath, inPath] of Object.entries(entryMap)) {
    tsupEntries[outPath] = inPath;
  }

  const external = [];
  if (pkgJson.peerDependencies) {
    external.push(...Object.keys(pkgJson.peerDependencies));
  }

  const entryStr = JSON.stringify(tsupEntries, null, 2)
    .replace(/\n/g, '\n  ')
    .replace(/\}\s*$/, '},');
  // Some .ts files contain JSX (e.g. state/index.ts), so treat all .ts as tsx
  const loaderConfig = "  loader: { '.ts': 'tsx' },";

  const tsupConfig = [
    "import { defineConfig } from 'tsup'",
    'export default defineConfig({',
    '  entry: ' + entryStr,
    "  format: 'esm',",
    "  outExtension: () => ({ js: '.js' }),",
    "  dts: { compilerOptions: { incremental: false } },",
    '  clean: true,',
    loaderConfig,
    '  external: ' + JSON.stringify(external) + ',',
    '  bundle: false,',
    '  splitting: false,',
    '})',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(pkgDir, 'tsup.config.ts'), tsupConfig);
  console.log(`[${pkgName}] Generated tsup.config.ts with ${Object.keys(tsupEntries).length} entries, external: [${external.join(', ')}]`);

  // --- Step 4: Update package.json fields (but NOT exports yet — do after build) ---
  if (builtExports['.']) {
    pkgJson.main = builtExports['.'].import;
    pkgJson.types = builtExports['.'].types;
  }
  pkgJson.files = ['dist', 'README.md', 'package.json'];

  pkgJson.scripts = pkgJson.scripts || {};
  pkgJson.scripts.build = 'tsup';
  pkgJson.scripts.clean = 'rimraf dist';
  pkgJson.scripts.prepublishOnly = 'npm run build';

  const [major, minor, patch] = pkgJson.version.split('.').map(Number);
  pkgJson.version = `${major}.${minor + 1}.0`;

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log(`[${pkgName}] Updated to v${pkgJson.version}`);
}

console.log('\nDone. Run `npm run build` in each package or from root.');
