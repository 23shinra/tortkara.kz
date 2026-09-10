#!/usr/bin/env python3
"""Download drilling tool photos from mc-bund.ru and build transparent catalog previews."""

from __future__ import annotations

import json
import io
import urllib.request
from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
CANVAS = (1600, 1200)
PAD = 64
BANNER_CROP_RATIO = 0.42  # marketing cards: product is on the left; keep text out

# mc-bund.ru/mcbund-instrument-dlja-burenija
# First URL becomes catalog-preview — prefer clean workshop shots, put marketing banners last.
PRODUCT_SOURCES: dict[str, list[str]] = {
    "casing-pipes": [
        "https://static.tildacdn.com/tild3562-3662-4138-b631-623763333665/_1.jpg",
        "https://static.tildacdn.com/tild3035-3936-4463-a532-383139326666/_.jpg",
        "https://static.tildacdn.com/tild6665-3262-4738-a336-353336623866/_2.jpg",
        "https://static.tildacdn.com/tild3566-6538-4566-a364-663964643630/_.jpg",
    ],
    "cutting-shoes": [
        "https://static.tildacdn.com/tild6333-6166-4430-b266-336236653831/_-1.jpg",
        "https://static.tildacdn.com/tild3637-6263-4566-b038-316532666330/_-2.jpg",
        "https://static.tildacdn.com/tild6333-3030-4235-b435-646262656139/_-3.jpg",
    ],
    "drilling-buckets": [
        "https://static.tildacdn.com/tild3363-6235-4164-b866-353836353834/-1.jpg",
        "https://static.tildacdn.com/tild3761-3062-4431-a434-666235646231/-2.jpg",
        "https://static.tildacdn.com/tild6666-3230-4733-b338-366139336537/-3.jpg",
        "https://static.tildacdn.com/tild3839-3363-4635-b264-393965656436/_.jpg",
    ],
    "pile-base-underreamers": [
        "https://static.tildacdn.com/tild3130-3530-4565-a433-316631623861/3.jpg",
        "https://static.tildacdn.com/tild3562-3232-4031-b737-326265663330/2.jpg",
        "https://static.tildacdn.com/tild3563-6266-4864-a431-386538393961/photo.jpg",
    ],
    "core-barrels": [
        "https://static.tildacdn.com/tild6163-6533-4566-b866-346130663863/_-1.jpg",
        "https://static.tildacdn.com/tild3063-3130-4866-b236-313432626633/_-2.jpg",
        "https://static.tildacdn.com/tild6330-3965-4763-b066-333238653332/_-3.jpg",
        "https://static.tildacdn.com/tild6531-6461-4134-a134-363634383137/____.jpg",
    ],
    "drilling-augers": [
        "https://static.tildacdn.com/tild6563-3166-4965-b730-393966333933/photo.jpg",
        "https://static.tildacdn.com/tild3933-3633-4664-a239-633762633834/-1.jpg",
        "https://static.tildacdn.com/tild3766-6564-4134-b738-633234633738/-2.jpg",
        "https://static.tildacdn.com/tild3931-6535-4664-b037-326538663032/photo.jpg",
    ],
    "casing-drivers": [
        "https://static.tildacdn.com/tild6634-6233-4264-b239-633261393864/-1.jpg",
        "https://static.tildacdn.com/tild3038-6537-4331-b438-623530653162/-2.jpg",
        "https://static.tildacdn.com/tild3834-6536-4432-b364-343437613136/-3.jpg",
    ],
}

BANNER_URLS = {
    url
    for urls in PRODUCT_SOURCES.values()
    for url in urls
    if any(
        token in url
        for token in (
            "tild3839-3363",
            "tild3931-6535",
            "tild3566-6538",
            "tild6531-6461",
        )
    )
}


def download(url: str) -> Image.Image:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req, timeout=60).read()
    return Image.open(io.BytesIO(data)).convert("RGBA")


def prepare_source(img: Image.Image, url: str) -> Image.Image:
    if url in BANNER_URLS and img.width > img.height * 1.5:
        cut = int(img.width * BANNER_CROP_RATIO)
        img = img.crop((0, 0, cut, img.height))
    return downscale(img)


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


def process_product(slug: str, urls: list[str]) -> list[str]:
    out_dir = ROOT / "public" / "products" / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    gallery_paths: list[str] = []
    preview_path: str | None = None

    for idx, url in enumerate(urls, start=1):
        print(f"[{slug}] {idx}/{len(urls)} download…")
        src = prepare_source(download(url), url)
        print(f"[{slug}] {idx}/{len(urls)} rembg…")
        cutout = remove(src)
        fitted = fit_on_canvas(cutout)
        rel = f"/products/{slug}/{idx:02d}.png"
        fitted.save(ROOT / "public" / rel.lstrip("/"), optimize=True)
        gallery_paths.append(rel)
        if preview_path is None:
            preview_path = rel.replace(f"/{idx:02d}.png", "/catalog-preview.png")
            fitted.save(ROOT / "public" / "products" / slug / "catalog-preview.png", optimize=True)
        print(f"[{slug}] saved {rel}")

    return gallery_paths


def update_products(processed: dict[str, list[str]]) -> None:
    path = ROOT / "data" / "products.json"
    products = json.loads(path.read_text(encoding="utf-8"))
    for product in products:
        slug = product["slug"]
        if slug not in processed:
            continue
        images = processed[slug]
        product["images"] = images
        product["catalogPreview"] = f"/products/{slug}/catalog-preview.png"
    path.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("products.json updated")


def main() -> None:
    processed: dict[str, list[str]] = {}
    for slug, urls in PRODUCT_SOURCES.items():
        processed[slug] = process_product(slug, urls)
    update_products(processed)
    print("ALL DONE")


if __name__ == "__main__":
    main()
