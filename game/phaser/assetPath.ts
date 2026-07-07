/** Caminho absoluto para assets em public/game-assets (funciona na Vercel) */
export function gameAsset(file: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/game-assets/${file}`
  }
  return `/game-assets/${file}`
}
