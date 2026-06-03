export type Actor = 'buyer' | 'vendor' | 'author' | 'admin' | 'system'
export type Role = 'admin' | 'user'

export interface ActorContext {
  actor: Actor
  role: Role
}
