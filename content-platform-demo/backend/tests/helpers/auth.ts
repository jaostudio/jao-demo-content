import { signJwt } from '../../src/lib/jwt'

export function getTokenFor(userId: string, role: string, name: string, email: string): string {
  return signJwt({ id: userId, role, name, email })
}
