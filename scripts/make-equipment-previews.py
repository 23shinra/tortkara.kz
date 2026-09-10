#!/usr/bin/env python3
"""Crop equipment tools from assortment photos and make transparent catalog previews."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
CANVAS = (1600, 1200)
PAD = 64

# source relative path + crop box (left, top, right, bottom)
CROPS: dict[str, tuple[str, tuple[int, int, int, int]]] = {
    "core-barrels": ("public/assortment/08.png", (55, 430, 210, 735)),
    "drilling-buckets": ("public/assortment/08.png", (195, 470, 355, 735)),
    "drilling-augers": ("public/assortment/08.png", (355, 430, 510, 745)),
    "pile-base-underreamers": ("public/assortment/08.png", (490, 470, 670, 745)),
    "cutting-shoes": ("public/assortment/08.png", (640, 500, 820, 745)),
    "kelly-bars": ("public/assortment/08.png", (720, 555, 1015, 745)),
    "casing-drivers": ("public/assortment/04.png", (30, 250, 300, 740)),
    "boerr-casing-oscillator": ("public/assortment/15.png", (20, 180, 740, 1000)),
    "leffer-casing-oscillator": ("public/assortment/15.png", (20, 180, 740, 1000)),
    "cfa-equipment": ("public/assortment/08.png", (355, 430, 510, 745)),
}

# Products without a credible standalone tool photo stay without preview.
SKIP_PREVIEW = {"tremie-pipes", "dds-equipment", "casing-pipes"}

# Alias gallery source after cutout (keep one clear photo in gallery too).
GALLERY_SRC = {
    "kelly-bars": "public/assortment/08.png",
    "boerr-casing-oscillator": "public/assortment/15.png",
    "leffer-casing-oscillator": "public/assortment/15.png",
    "casing-pipes": "public/assortment/03.png",
    "cutting-shoes": "public/assortment/08.png",
    "drilling-buckets": "public/assortment/08.png",
    "pile-base-underreamers": "public/assortment/08.png",
    "core-barrels": "public/assortment/08.png",
    "drilling-augers": "public/assortment/08.png",
    "casing-drivers": "public/assortment/04.png",
    "cfa-equipment": "public/assortment/08.png",
}


def downscale(img: Image.Image, max_side: int = 1800) -> Image.Image:
    w, h = img.size
    scale = min(1.0, max_side / max(w, h))
    if scale >= 1:
        return img
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def alpha_bbox(img: Image.Image, threshold: int = 8) -> tuple[int, int, int, int]:
    alpha = img.split()[-1]
    mask = alpha.point(lambda p: 255 if p > threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return (0, 0, img.width, img.height)
    return bbox


def fit_on_canvas(cutout: Image.Image) -> Image.Image:
    bbox = alpha_bbox(cutout)
    cropped = cutout.crop(bbox)
    max_w = CANVAS[0] - PAD * 2
    max_h = CANVAS[1] - PAD * 2
    cw, ch = cropped.size
    scale = min(max_w / cw, max_h / ch)
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    resized = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    x = (CANVAS[0] - nw) // 2
    y = (CANVAS[1] - nh) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def process(slug: str, src_rel: str, box: tuple[int, int, int, int]) -> Path:
    src = ROOT / src_rel
    img = Image.open(src).convert("RGBA").crop(box)
    img = downscale(img)
    print(f"[{slug}] rembg from {src_rel} {box}…")
    cut = remove(img)
    preview = fit_on_canvas(cut)
    out_dir = ROOT / "public" / "products" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    # Save cutout as gallery image 01 and catalog preview
    gallery = out_dir / "01.png"
    preview.save(gallery, optimize=True)
    preview_path = out_dir / "catalog-preview.png"
    preview.save(preview_path, optimize=True)
    print(f"[{slug}] -> {preview_path} ({preview_path.stat().st_size // 1024} KB)")
    return preview_path


def update_products() -> None:
    path = ROOT / "data" / "products.json"
    products = json.loads(path.read_text(encoding="utf-8"))
    for product in products:
        slug = product["slug"]
        if product.get("section") != "drilling-equipment":
            continue
        if slug in SKIP_PREVIEW:
            product["images"] = []
            product.pop("catalogPreview", None)
            continue
        if slug not in CROPS:
            continue
        preview = f"/products/{slug}/catalog-preview.png"
        image = f"/products/{slug}/01.png"
        product["catalogPreview"] = preview
        product["images"] = [image]
    path.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("products.json updated")


def main() -> None:
    for slug, (src, box) in CROPS.items():
        process(slug, src, box)
    update_products()
    print("ALL DONE")


if __name__ == "__main__":
    main()
