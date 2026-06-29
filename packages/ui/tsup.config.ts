import { defineConfig } from 'tsup'
export default defineConfig({
  entry: {
    "index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\index.ts",
    "button": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\button.tsx",
    "card": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\card.tsx",
    "sections/index": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\index.ts",
    "sections/case-studies": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\case-studies.tsx",
    "sections/contact": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\contact.tsx",
    "sections/hero": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\hero.tsx",
    "sections/process": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\process.tsx",
    "sections/proof": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\proof.tsx",
    "sections/registry": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\registry.ts",
    "sections/services": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\services.tsx",
    "sections/testimonials": "C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\packages\\ui\\src\\sections\\testimonials.tsx"
  },
  format: 'esm',
  outExtension: () => ({ js: '.js' }),
  dts: { compilerOptions: { incremental: false } },
  clean: true,
  loader: { '.ts': 'tsx' },
  external: ["react","react-dom","@jaostudio/engine"],
  esbuildOptions: (options) => { options.jsx = 'automatic' },
  bundle: true,
  splitting: false,
})
