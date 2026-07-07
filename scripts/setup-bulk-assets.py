#!/usr/bin/env python3
"""Baixa e organiza assets em massa para o Harvest Ops."""
from __future__ import annotations

import json
import shutil
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_TREES = ROOT / "public/game-assets/imported/trees/processed"
OUT_BLOCKS = ROOT / "public/game-assets/imported/blocks"
MANIFEST_TREES = ROOT / "public/game-assets/imported/trees/manifest.json"
MANIFEST_BLOCKS = ROOT / "public/game-assets/imported/blocks/manifest.json"
TMP = Path("/tmp/assets-dl")

KENNEY_TILES = (
    "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/voxel-pack/PNG/Tiles"
)
BLOCK_SOURCES = {
    "block_grass": "grass_top.png",
    "block_dirt": "dirt.png",
    "block_sand": "sand.png",
    "block_stone": "stone.png",
    "block_water": "water.png",
    "block_wood": "wood.png",
    "block_snow": "snow.png",
    "block_ore": "stone_gold.png",
    "block_wheat": "wheat_stage4.png",
    "block_leaves": "leaves.png",
    "block_lava": "lava.png",
    "block_ice": "ice.png",
}


def download_kenney_blocks(out: Path) -> list[dict]:
    out.mkdir(parents=True, exist_ok=True)
    entries = []
    for key, src in BLOCK_SOURCES.items():
        dest = out / f"{key}.png"
        url = f"{KENNEY_TILES}/{src}"
        urllib.request.urlretrieve(url, dest)
        entries.append({"key": key, "file": f"imported/blocks/{key}.png"})
    return entries


def collect_trees(tmp: Path, out: Path, max_trees: int = 48) -> list[dict]:
    out.mkdir(parents=True, exist_ok=True)
    entries: list[dict] = []
    seen = 0
    for png in sorted(tmp.glob("**/*.png")):
        if "_tree_" not in str(png) and "tree_" not in png.name:
            continue
        if png.stat().st_size < 500:
            continue
        key = f"tree_{seen + 1:03d}"
        dest = out / f"{key}.png"
        shutil.copy2(png, dest)
        entries.append({"key": key, "file": f"imported/trees/processed/{key}.png"})
        seen += 1
        if seen >= max_trees:
            break
    return entries


def main() -> None:
    OUT_BLOCKS.mkdir(parents=True, exist_ok=True)
    blocks = download_kenney_blocks(OUT_BLOCKS)

    trees: list[dict] = []
    if TMP.exists():
        trees = collect_trees(TMP, OUT_TREES)
    # Mantém árvores já existentes se não achou tmp
    if not trees:
        for png in sorted(OUT_TREES.glob("*.png")):
            trees.append({"key": png.stem, "file": f"imported/trees/processed/{png.name}"})

    MANIFEST_TREES.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_TREES.write_text(json.dumps({"trees": trees}, indent=2), encoding="utf-8")
    MANIFEST_BLOCKS.write_text(json.dumps({"blocks": blocks}, indent=2), encoding="utf-8")
    print(f"Blocks: {len(blocks)} | Trees: {len(trees)}")


if __name__ == "__main__":
    main()
