import { defineConfig } from 'tsup'
export default defineConfig({
  entry: {
    "index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\index.ts",
    "types/index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\types\\index.ts",
    "types/composition": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\types\\composition.ts",
    "types/industry": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\types\\industry.ts",
    "types/registry": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\types\\registry.ts",
    "types/section": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\types\\section.ts",
    "rendering/index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\rendering\\index.ts",
    "rendering/page-renderer": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\rendering\\page-renderer.tsx",
    "rendering/section-renderer": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\rendering\\section-renderer.tsx",
    "transitions/index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\transitions\\index.ts",
    "transitions/variants": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\transitions\\variants.ts",
    "theme/index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\theme\\index.ts",
    "composition/index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\engine\\src\\composition\\index.ts"
  },
  format: 'esm',
  outExtension: () => ({ js: '.js' }),
  dts: { compilerOptions: { incremental: false } },
  clean: true,
  loader: { '.ts': 'tsx' },
  external: ["react","react-dom","framer-motion"],
  esbuildOptions: (options) => { options.jsx = 'automatic' },
  bundle: true,
  splitting: false,
})
