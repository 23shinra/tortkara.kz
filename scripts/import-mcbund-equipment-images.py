#!/usr/bin/env python3
"""Download equipment photos from mc-bund.ru for split catalog slugs."""

from __future__ import annotations

import hashlib
import io
import json
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CANVAS = (1600, 1200)
PAD = 48

KELLI_GALLERY = [
    "https://static.tildacdn.com/tild3363-6337-4563-a330-316661313733/KELLI1.jpg",
    "https://static.tildacdn.com/tild3932-3938-4432-b339-373237653161/kelli-6.jpg",
    "https://static.tildacdn.com/tild3865-3232-4537-a239-393630353634/kelli-3.jpg",
    "https://static.tildacdn.com/tild3365-3339-4365-a537-623335393637/kelli-4.jpg",
]

PRODUCT_SOURCES: dict[str, list[str]] = {
    "kelly-bars-sany": KELLI_GALLERY,
    "kelly-bars-xcmg": KELLI_GALLERY,
    "kelly-bars-zoomlion": KELLI_GALLERY,
    "kelly-bars-sunward": KELLI_GALLERY,
    "kelly-bars-bauer": KELLI_GALLERY,
    "kelly-bars-liebherr": KELLI_GALLERY,
    "kelly-bars-casagrande": KELLI_GALLERY,
    "kelly-bars-soilmec": KELLI_GALLERY,
    "kelly-bars-mait": KELLI_GALLERY,
    "kelly-bars-tescar": KELLI_GALLERY,
    "boerr-co-1000": [
        "https://static.tildacdn.com/tild3866-6138-4734-b133-393632306162/BOERR_CO1000__2.jpg",
        "https://static.tildacdn.com/tild3538-6663-4463-a432-393566336230/Obsadnoj_stol_BOERR_.png",
        "https://static.tildacdn.com/tild3865-3836-4464-a238-376666346630/obsadnoj-stol-1.jpg",
        "https://static.tildacdn.com/tild6663-3032-4365-b261-643836373531/obsadnoj_stol_princi.png",
    ],
    "boerr-co-1180": [
        "https://static.tildacdn.com/tild3732-6330-4463-b032-363532383566/BOERR_CO1180__3.jpg",
        "https://static.tildacdn.com/tild3538-6663-4463-a432-393566336230/Obsadnoj_stol_BOERR_.png",
        "https://static.tildacdn.com/tild3865-3836-4464-a238-376666346630/obsadnoj-stol-1.jpg",
    ],
    "boerr-co-1500": [
        "https://static.tildacdn.com/tild3865-3836-4464-a238-376666346630/obsadnoj-stol-1.jpg",
    ],
    "boerr-co-2000": [
        "https://static.tildacdn.com/tild3865-3836-4464-a238-376666346630/obsadnoj-stol-1.jpg",
    ],
    "leffer-vrm-1180": [
        "https://static.tildacdn.com/tild6435-3731-4263-b531-323538373238/LEFFER_VRM_1180__1.jpg",
        "https://static.tildacdn.com/tild3266-3539-4963-b339-373139303035/obsadnoj_stol_leffer.jpg",
    ],
    "leffer-vrm-1300": [
        "https://static.tildacdn.com/tild3266-3539-4963-b339-373139303035/obsadnoj_stol_leffer.jpg",
    ],
    "leffer-vrm-1500": [
        "https://static.tildacdn.com/tild6665-3733-4066-a132-363864366235/LEFFER_VRM_1500__1.jpg",
        "https://static.tildacdn.com/tild3266-3539-4963-b339-373139303035/obsadnoj_stol_leffer.jpg",
    ],
    "leffer-vrm-2000": [
        "https://static.tildacdn.com/tild3266-3539-4963-b339-373139303035/obsadnoj_stol_leffer.jpg",
    ],
    "cfa-transport-auger": [
        "https://static.tildacdn.com/tild6563-3166-4965-b730-393966333933/photo.jpg",
        "https://static.tildacdn.com/tild3933-3633-4664-a239-633762633834/-1.jpg",
    ],
    "cfa-leading-section": [
        "https://static.tildacdn.com/tild3766-6564-4134-b738-633234633738/-2.jpg",
        "https://static.tildacdn.com/tild3931-6535-4664-b037-326538663032/photo.jpg",
    ],
    "dds-displacement-tool": [
        "https://static.tildacdn.com/tild3130-3530-4565-a433-316631623861/3.jpg",
        "https://static.tildacdn.com/tild3562-3232-4031-b737-326265663330/2.jpg",
    ],
}


def download(url: str) -> Image.Image:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req, timeout=60).read()
    return Image.open(io.BytesIO(data)).convert("RGBA")


def downscale(img: Image.Image, max_side: int = 1800) -> Image.Image:
    w, h = img.size
    scale = min(1.0, max_side / max(w, h))
    if scale >= 1:
        return img
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def fit_preview(img: Image.Image) -> Image.Image:
    fitted = downscale(img)
    fw, fh = fitted.size
    max_w = CANVAS[0] - PAD * 2
    max_h = CANVAS[1] - PAD * 2
    scale = min(max_w / fw, max_h / fh)
    nw, nh = max(1, int(fw * scale)), max(1, int(fh * scale))
    resized = fitted.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (255, 255, 255, 255))
    x = (CANVAS[0] - nw) // 2
    y = (CANVAS[1] - nh) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def dedupe_urls(urls: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for url in urls:
        if url in seen:
            continue
        seen.add(url)
        out.append(url)
    return out


def process_product(slug: str, urls: list[str]) -> list[str]:
    out_dir = ROOT / "public" / "products" / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    gallery_paths: list[str] = []
    seen_hashes: set[str] = set()

    for idx, url in enumerate(dedupe_urls(urls), start=1):
        print(f"[{slug}] {idx} download {url}")
        img = downscale(download(url))
        digest = hashlib.sha256(img.tobytes()).hexdigest()
        if digest in seen_hashes:
            print(f"[{slug}] skip duplicate hash")
            continue
        seen_hashes.add(digest)

        rel = f"/products/{slug}/{idx:02d}.png"
        img.save(ROOT / "public" / rel.lstrip("/"), optimize=True)
        gallery_paths.append(rel)
        if len(gallery_paths) == 1:
            fit_preview(img).save(out_dir / "catalog-preview.png", optimize=True)
        print(f"[{slug}] saved {rel}")

    return gallery_paths


def update_products(processed: dict[str, list[str]]) -> None:
    path = ROOT / "data" / "products.json"
    products = json.loads(path.read_text(encoding="utf-8"))
    for product in products:
        slug = product["slug"]
        if slug not in processed or not processed[slug]:
            continue
        product["images"] = processed[slug]
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
