import manifest from '@/public/game-assets/imported/trees/manifest.json'
import { gameAsset } from './assetPath'

export type TreeEntry = { key: string; file: string }

export const IMPORTED_TREES: TreeEntry[] = manifest.trees

export function treeAssetUrl(entry: TreeEntry): string {
  return gameAsset(entry.file)
}
