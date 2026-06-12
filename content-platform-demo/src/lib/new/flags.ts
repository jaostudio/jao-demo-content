export function useNewLayout(): boolean {
  return process.env.NEXT_PUBLIC_NEW_LAYOUT === 'true'
}

export const NEW_LAYOUT_ENABLED = process.env.NEXT_PUBLIC_NEW_LAYOUT === 'true'
