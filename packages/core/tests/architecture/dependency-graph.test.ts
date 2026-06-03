import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..', '..', '..', '..')

interface PkgJson { name: string; dependencies?: Record<string, string>; private?: boolean }

const FORBIDDEN: Record<string, string[]> = {
  '@jaostudio/core': ['@jaostudio/engine', '@jaostudio/ui', '@jaostudio/analytics', '@jaostudio/config'],
  '@jaostudio/engine': ['@jaostudio/core', '@jaostudio/ui', '@jaostudio/analytics', '@jaostudio/config'],
  '@jaostudio/ui': ['@jaostudio/core', '@jaostudio/engine', '@jaostudio/analytics', '@jaostudio/config'],
  '@jaostudio/analytics': ['@jaostudio/core', '@jaostudio/engine', '@jaostudio/ui', '@jaostudio/config'],
}

const SIBLING_DEMOS = [
  'landingpage-demo', 'commerce-demo', 'marketplace-demo',
  'content-platform-demo', 'database-security-demo', 'web-application-demo',
]

function loadPkg(dir: string): PkgJson {
  return JSON.parse(readFileSync(resolve(dir, 'package.json'), 'utf-8'))
}

function test() {
  const rootPkg = loadPkg(root)
  const workspaces = rootPkg.workspaces as string[]

  const errors: string[] = []

  for (const ws of workspaces) {
    const pkgDir = resolve(root, ws.replaceAll('\\', '/'))
    let pkg: PkgJson
    try { pkg = loadPkg(pkgDir) } catch { continue }

    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }

    for (const [dep, _version] of Object.entries(deps)) {
      const isWorkspacePkg = Object.values(FORBIDDEN).some((f) => f.includes(dep))
      const isDemo = SIBLING_DEMOS.includes(dep)

      if (isDemo && SIBLING_DEMOS.includes(pkg.name)) {
        errors.push(`${pkg.name} imports sibling demo: ${dep}`)
      }

      if (FORBIDDEN[pkg.name]?.includes(dep)) {
        errors.push(`${pkg.name} has forbidden import: ${dep}`)
      }
    }
  }

  if (errors.length > 0) {
    console.error('Dependency violations:\n' + errors.map((e) => `  ❌ ${e}`).join('\n'))
    process.exit(1)
  }
  console.log('✅ Dependency graph: clean')
}

test()
