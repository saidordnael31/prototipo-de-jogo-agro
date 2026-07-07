#!/usr/bin/env python3
"""
Processa árvores coladas em public/game-assets/imported/trees/raw/
Suporta: PNG/GIF, fundo preto, sprites estilo RPG Maker (árvore à direita).

Uso:
  python3 scripts/process-imported-trees.py
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "public/game-assets/imported/trees/raw"
OUT = ROOT / "public/game-assets/imported/trees/processed"
MANIFEST = ROOT / "public/game-assets/imported/trees/manifest.json"

BLACK_THRESHOLD = 28


def remove_black_bg(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r < BLACK_THRESHOLD and g < BLACK_THRESHOLD and b < BLACK_THRESHOLD:
                px[x, y] = (0, 0, 0, 0)
    return img


def crop_tree(img: Image.Image) -> Image.Image:
    """RPG Maker: árvore costuma ficar na metade direita do sheet 128x128."""
    w, h = img.size
    if w == 128 and h == 128:
        right = img.crop((w // 2, 0, w, h))
        if right.getbbox():
            return right
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img


def main() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    files = sorted([*RAW.glob("*.png"), *RAW.glob("*.gif"), *RAW.glob("*.PNG"), *RAW.glob("*.GIF")])
    if not files:
        print(f"Nenhum arquivo em {RAW}")
        print("Cole seus PNGs/GIFs do itch/Kenney nessa pasta e rode de novo.")
        return

    entries: list[dict] = []
    for i, path in enumerate(files):
        img = Image.open(path)
        if getattr(img, "is_animated", False):
            img.seek(0)
        processed = crop_tree(remove_black_bg(img.copy()))
        out_name = f"user_tree_{i + 1:02d}.png"
        out_path = OUT / out_name
        processed.save(out_path)
        entries.append({"key": out_name.replace(".png", ""), "file": f"imported/trees/processed/{out_name}"})
        print(f"OK {path.name} -> {out_name} ({processed.size[0]}x{processed.size[1]})")

    # Preserva árvores já existentes (ex: OpenGameArt)
    for existing in sorted(OUT.glob("_tree_*.png")):
        key = existing.stem
        file = f"imported/trees/processed/{existing.name}"
        if not any(e["key"] == key for e in entries):
            entries.append({"key": key, "file": file})

    for existing in sorted(OUT.glob("user_tree_*.png")):
        key = existing.stem
        file = f"imported/trees/processed/{existing.name}"
        if not any(e["key"] == key for e in entries):
            entries.append({"key": key, "file": file})

    MANIFEST.write_text(json.dumps({"trees": entries}, indent=2), encoding="utf-8")
    print(f"\nManifest: {MANIFEST} ({len(entries)} árvores)")


if __name__ == "__main__":
    main()
