#!/usr/bin/env python3
"""Normalize illustrations to the production size: 1200x1500 (4:5).

Scales to cover, center-crops, and saves back as PNG. Master plan section 3:
one consistent aspect ratio and resolution across all 25 so the layout needs
no per-scenario CSS. Short side ends at >= 1200px as required.
"""
import sys
from pathlib import Path

from PIL import Image

TARGET = (1200, 1500)


def normalize(path: Path) -> None:
    img = Image.open(path).convert("RGB")
    w, h = img.size
    scale = max(TARGET[0] / w, TARGET[1] / h)
    nw, nh = round(w * scale), round(h * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    left = (nw - TARGET[0]) // 2
    top = (nh - TARGET[1]) // 2
    img = img.crop((left, top, left + TARGET[0], top + TARGET[1]))
    img.save(path, "PNG", optimize=True)
    print(f"OK   {path.name} -> {TARGET[0]}x{TARGET[1]}")


if __name__ == "__main__":
    targets = [Path(a) for a in sys.argv[1:]] or sorted(
        Path(__file__).resolve().parent.parent.joinpath("public/assets/images").glob("*.png")
    )
    for t in targets:
        normalize(t)
    sys.exit(0)
