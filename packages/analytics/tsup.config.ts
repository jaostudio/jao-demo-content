import { defineConfig } from 'tsup'
export default defineConfig({
  entry: {
    "index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\analytics\\src\\index.ts"
  },
  format: 'esm',
  outExtension: () => ({ js: '.js' }),
  dts: { compilerOptions: { incremental: false } },
  clean: true,
  loader: { '.ts': 'tsx' },
  external: ["next","react","react-dom"],
  esbuildOptions: (options) => { options.jsx = 'automatic' },
  bundle: true,
  splitting: false,
})
