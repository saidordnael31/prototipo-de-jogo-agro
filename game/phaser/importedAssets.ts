import treesManifest from '@/public/game-assets/imported/trees/manifest.json'
import blocksManifest from '@/public/game-assets/imported/blocks/manifest.json'
import { gameAsset } from './assetPath'

export type TreeEntry = { key: string; file: string }
export type BlockEntry = { key: string; file: string }

export const IMPORTED_TREES: TreeEntry[] = treesManifest.trees
export const IMPORTED_BLOCKS: BlockEntry[] = blocksManifest.blocks

export function assetUrl(file: string): string {
  return gameAsset(file)
}
