#!/usr/bin/env python3
"""Palette + size audit for Quietfield illustrations (master plan sections 3-4).

A pixel passes if it is near one of the four brand tokens OR near any line
segment joining two tokens: any legitimate blend (anti-aliasing, tonal steps,
opacity) of the four-token palette lies inside that hull. Genuinely foreign
hues (greens, cyans, pinks, pure white) fall outside and are flagged.

Also enforces the 1200x1500 (4:5) production size.
"""
import sys
from pathlib import Path

from PIL import Image

TOKENS = {
    "ink": (0x1E, 0x1E, 0x17),
    "cream": (0xEF, 0xE7, 0xDB),
    "rust": (0x90, 0x4A, 0x30),
    "tan": (0x84, 0x81, 0x77),
}
VERTEX_TOL = 45
SEGMENT_TOL = 35


def dist(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5


def dist_to_segment(p, a, b):
    ax, ay, az = a
    bx, by, bz = b
    px, py, pz = p
    abx, aby, abz = bx - ax, by - ay, bz - az
    apx, apy, apz = px - ax, py - ay, pz - az
    ab2 = abx * abx + aby * aby + abz * abz
    t = 0 if ab2 == 0 else max(0, min(1, (apx * abx + apy * aby + apz * abz) / ab2))
    cx, cy, cz = ax + t * abx, ay + t * aby, az + t * abz
    return dist(p, (cx, cy, cz))


TOKEN_LIST = list(TOKENS.values())
SEGMENTS = [
    (TOKEN_LIST[i], TOKEN_LIST[j])
    for i in range(4)
    for j in range(i + 1, 4)
]


def pixel_ok(p):
    for v in TOKEN_LIST:
        if dist(p, v) <= VERTEX_TOL:
            return True
    for a, b in SEGMENTS:
        if dist_to_segment(p, a, b) <= SEGMENT_TOL:
            return True
    return False


def audit(path: Path) -> int:
    img = Image.open(path).convert("RGB")
    w, h = img.size
    problems = []

    if (w, h) != (1200, 1500):
        problems.append(f"size {w}x{h}, expected 1200x1500")

    small = img.resize((160, 200))
    data = list(small.getdata())
    foreign = [
        p for p in data if not pixel_ok(p)
    ]
    pct = 100 * len(foreign) / len(data)
    if pct > 0.5:
        from collections import Counter

        def hexs(p):
            return "#{:02X}{:02X}{:02X}".format(*p)

        top = Counter(hexs(p) for p in foreign).most_common(5)
        problems.append(f"{pct:.2f}% off-palette pixels, e.g. {top}")

    status = "OK  " if not problems else "FAIL"
    print(f"{status} {path.name} {w}x{h} off-palette={pct:.2f}%")
    for pr in problems:
        print(f"     -> {pr}")
    return 1 if problems else 0


if __name__ == "__main__":
    targets = [Path(a) for a in sys.argv[1:]] or sorted(
        Path(__file__).resolve().parent.parent.joinpath("public/assets/images").glob("*.png")
    )
    bad = sum(audit(t) for t in targets)
    sys.exit(1 if bad else 0)
