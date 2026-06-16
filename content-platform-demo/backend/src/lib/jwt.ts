import jwt from 'jsonwebtoken'

const SECRET = process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production'

export function signJwt(payload: Record<string, unknown>): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyJwt(token: string): Record<string, unknown> | null {
  try {
    return jwt.verify(token, SECRET) as Record<string, unknown>
  } catch {
    return null
  }
}
