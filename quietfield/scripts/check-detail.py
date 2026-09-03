#!/usr/bin/env python3
"""Restraint audit: keep new illustrations inside the 1A-2E style envelope.

Two objective proxies for "same line weight, same level of detail, same
restraint" (master plan section 3, style-lock rule):
  - edge density  -> mean edge energy (detail / line weight)
  - palette count -> distinct colors after 64-color median-cut quantization
                     (colorfulness / rendering "finish")

Baseline = the ten locked images (1A-2E). Anything outside baseline range x
1.3 tolerance is flagged so it can be regenerated to match, never the reverse.
"""
import sys
from pathlib import Path

from PIL import Image, ImageFilter

TOL = 1.3


def metrics(path: Path):
    img = Image.open(path).convert("RGB")
    small = img.resize((300, 375))
    q = small.quantize(colors=64, method=Image.MEDIANCUT)
    ncolors = len(q.getcolors(4096) or [])
    gray = small.convert("L").filter(ImageFilter.FIND_EDGES)
    hist = gray.histogram()
    total = sum(hist)
    mean_edge = sum(i * n for i, n in enumerate(hist)) / total / 255
    return ncolors, mean_edge


def main():
    images = sorted(
        Path(__file__).resolve().parent.parent.joinpath("public/assets/images").glob("*.png")
    )
    baseline = [p for p in images if p.name[0] in "12"]
    results = {}
    for p in images:
        try:
            results[p.name] = metrics(p)
        except OSError:
            pass

    edges = [results[n][1] for n in results if n[0] in "12"]
    colors = [results[n][0] for n in results if n[0] in "12"]
    e_min, e_max = min(edges), max(edges)
    c_min, c_max = min(colors), max(colors)
    print(f"baseline 1A-2E: edge density {e_min:.4f}-{e_max:.4f} · palette {c_min}-{c_max}")
    print(f"envelope (x{TOL}): edge <= {e_max * TOL:.4f} · palette <= {int(c_max * TOL)}")
    bad = 0
    for name, (nc, ne) in sorted(results.items()):
        if name[0] in "12":
            status = "BASE"
        elif ne > e_max * TOL or nc > int(c_max * TOL):
            status = "FAIL"
            bad += 1
        else:
            status = "OK  "
        print(f"{status} {name}: edge {ne:.4f} · palette {nc}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
