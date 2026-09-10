#!/usr/bin/env python3
"""Remove mc-bund branded photos and deduplicate product galleries."""

from __future__ import annotations

import hashlib
import json
import shutil
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "data" / "products.json"
PUBLIC_PRODUCTS = ROOT / "public" / "products"
CANVAS = (1600, 1200)
PAD = 48

IMAGE_SOURCE_MAP = {
    "kelly-bars-sany": "kelly-bars",
    "kelly-bars-casagrande": "kelly-bars",
    "kelly-bars-soilmec": "kelly-bars",
    "kelly-bars-mait": "kelly-bars",
    "kelly-bars-tescar": "kelly-bars",
    "boerr-co-1000": "boerr-casing-oscillator",
    "boerr-co-1180": "boerr-casing-oscillator",
    "boerr-co-1500": "boerr-casing-oscillator",
    "boerr-co-2000": "boerr-casing-oscillator",
    "leffer-vrm-1180": "leffer-casing-oscillator",
    "leffer-vrm-1300": "leffer-casing-oscillator",
    "leffer-vrm-1500": "leffer-casing-oscillator",
    "leffer-vrm-2000": "leffer-casing-oscillator",
    "casing-standard": "casing-pipes",
    "casing-reinforced": "casing-pipes",
    "knife-leading-section": "cutting-shoes",
    "casing-driver": "casing-drivers",
    "casing-support-frame": "casing-drivers",
    "auger-sb-k": "drilling-augers",
    "auger-sb-k2": "drilling-augers",
    "auger-sbf-k": "drilling-augers",
    "auger-sbf-k2": "drilling-augers",
    "auger-sbf-p": "drilling-augers",
    "auger-sbf-p2": "drilling-augers",
    "bucket-kbf-k": "drilling-buckets",
    "bucket-kbf-k2": "drilling-buckets",
    "bucket-kbf-p": "drilling-buckets",
    "bucket-kc-2zr": "drilling-buckets",
    "bucket-kb-k": "drilling-buckets",
    "bucket-kb-k2": "drilling-buckets",
    "core-kr-r": "core-barrels",
    "core-ks-r": "core-barrels",
    "core-kr-rm": "core-barrels",
    "core-kr-ws": "core-barrels",
    "pile-base-underreamer": "pile-base-underreamers",
    "cfa-transport-auger": "cfa-equipment",
    "cfa-leading-section": "cfa-equipment",
    "dds-displacement-tool": "cfa-equipment",
    "cardan-washer-flange": "casing-drivers",
}


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def drop_reason(path: Path, *, equipment: bool) -> str | None:
    if "source-clean" in path.name.lower():
        return "legacy-source"

    if not equipment:
        return None

    img = Image.open(path).convert("RGB")
    w, h = img.size
    ratio = w / max(h, 1)
    mean = sum(ImageStat.Stat(img).mean) / 3

    # mc-bund dark hero banners (КЕЛЛИ-ШТАНГИ + mc-bund.ru)
    if ratio >= 1.75 and w >= 1400 and h >= 650 and mean < 120:
        return "dark-hero"

    # Bright compatibility cards with МАКБУНД logo
    if ratio >= 1.7 and w >= 1600 and h >= 850 and mean >= 120:
        return "info-card"

    # Workshop photos with bottom МАКБУНД watermark
    if 0.55 <= ratio <= 1.45 and 80 <= mean <= 175:
        crop = img.crop((int(w * 0.15), int(h * 0.78), int(w * 0.85), h))
        pixels = list(crop.getdata())
        if pixels:
            bright = sum(1 for r, g, b in pixels if r > 210 and g > 210 and b > 210) / len(pixels)
            if 0.03 <= bright <= 0.18:
                return "watermark"

    return None


def image_score(path: Path) -> tuple[float, str]:
    """Higher is better for gallery ordering."""
    img = Image.open(path).convert("RGB")
    w, h = img.size
    ratio = w / max(h, 1)
    mean = sum(ImageStat.Stat(img).mean) / 3
    # Prefer clean product renders and workshop shots without extreme aspect ratios
    aspect_penalty = abs(ratio - 1.0)
    if ratio > 3.5:
        aspect_penalty += 2.0
    return (mean - aspect_penalty * 20, path.name)


def fit_preview(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    scale = min(1.0, 1800 / max(w, h))
    if scale < 1:
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    fw, fh = img.size
    max_w = CANVAS[0] - PAD * 2
    max_h = CANVAS[1] - PAD * 2
    s = min(max_w / fw, max_h / fh)
    nw, nh = max(1, int(fw * s)), max(1, int(fh * s))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (255, 255, 255, 255))
    canvas.paste(resized, ((CANVAS[0] - nw) // 2, (CANVAS[1] - nh) // 2), resized)
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, optimize=True)


def list_gallery_files(slug_dir: Path) -> list[Path]:
    if not slug_dir.exists():
        return []
    files = [
        p
        for p in slug_dir.iterdir()
        if p.is_file()
        and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
        and p.name != "catalog-preview.png"
    ]
    return sorted(files, key=lambda p: p.name)


def clean_file_pool(slug: str, equipment: bool) -> list[Path]:
    slug_dir = PUBLIC_PRODUCTS / slug
    kept: list[Path] = []
    seen_hashes: set[str] = set()

    for path in list_gallery_files(slug_dir):
        reason = drop_reason(path, equipment=equipment)
        if reason:
            print(f"  drop [{reason}] {slug}/{path.name}")
            path.unlink(missing_ok=True)
            continue

        digest = file_hash(path)
        if digest in seen_hashes:
            print(f"  drop [duplicate] {slug}/{path.name}")
            path.unlink(missing_ok=True)
            continue

        seen_hashes.add(digest)
        kept.append(path)

    return kept


def write_gallery(slug: str, source_paths: list[Path]) -> list[str]:
    slug_dir = PUBLIC_PRODUCTS / slug
    tmp_dir = slug_dir.with_name(f".{slug}-tmp")
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)
    tmp_dir.mkdir(parents=True)

    rel_paths: list[str] = []
    for idx, src in enumerate(source_paths, start=1):
        ext = src.suffix.lower()
        out_ext = ".png" if ext == ".png" else ext
        dest = tmp_dir / f"{idx:02d}{out_ext}"
        shutil.copy2(src, dest)
        rel_paths.append(f"/products/{slug}/{dest.name}")

    # Remove old gallery files from slug dir, keep only what we rewrite
    if slug_dir.exists():
        for old in list_gallery_files(slug_dir):
            old.unlink(missing_ok=True)
    else:
        slug_dir.mkdir(parents=True)

    for item in tmp_dir.iterdir():
        shutil.move(str(item), slug_dir / item.name)
    tmp_dir.rmdir()

    if rel_paths:
        fit_preview(slug_dir / Path(rel_paths[0]).name, slug_dir / "catalog-preview.png")
    elif (slug_dir / "catalog-preview.png").exists():
        (slug_dir / "catalog-preview.png").unlink()

    return rel_paths


def build_variant_groups(products: list[dict]) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = defaultdict(list)
    equipment_slugs = {p["slug"] for p in products if p.get("section") == "drilling-equipment"}

    for slug in sorted(equipment_slugs):
        source = IMAGE_SOURCE_MAP.get(slug, slug)
        groups[source].append(slug)

    return {k: v for k, v in groups.items() if len(v) > 1}


def assign_group_galleries(group_slugs: list[str], pools: dict[str, list[Path]]) -> dict[str, list[Path]]:
    unique: dict[str, Path] = {}
    for slug in group_slugs:
        for path in pools.get(slug, []):
            unique.setdefault(file_hash(path), path)

    ranked = sorted(unique.values(), key=image_score, reverse=True)
    if not ranked:
        return {slug: [] for slug in group_slugs}

    assignments: dict[str, list[Path]] = {}
    primary = group_slugs[0]
    assignments[primary] = ranked[: min(4, len(ranked))]

    for idx, slug in enumerate(group_slugs[1:], start=1):
        pick = ranked[idx % len(ranked)]
        assignments[slug] = [pick]

    return assignments


def main() -> None:
    products = json.loads(PRODUCTS_PATH.read_text(encoding="utf-8"))
    equipment_slugs = {p["slug"] for p in products if p.get("section") == "drilling-equipment"}

    # Phase 1: remove branded / duplicate files per slug
    pools: dict[str, list[Path]] = {}
    for product in products:
        slug = product["slug"]
        if product.get("section") != "drilling-equipment":
            continue
        equipment = slug in equipment_slugs
        print(f"Scan {slug}")
        pools[slug] = clean_file_pool(slug, equipment=equipment)

    # Phase 2: split identical galleries across variant groups
    groups = build_variant_groups(products)
    final_paths: dict[str, list[Path]] = {}

    grouped_slugs: set[str] = set()
    for source, slugs in groups.items():
        grouped_slugs.update(slugs)
        assigned = assign_group_galleries(slugs, pools)
        for slug, paths in assigned.items():
            final_paths[slug] = paths
            print(f"Group {source}: {slug} -> {len(paths)} image(s)")

    for slug, paths in pools.items():
        if slug not in grouped_slugs:
            final_paths[slug] = paths

    # Phase 3: rewrite galleries with stable numbering + update JSON
    for product in products:
        slug = product["slug"]
        if product.get("section") != "drilling-equipment":
            continue
        selected = final_paths.get(slug, [])
        if not selected:
            product["images"] = []
            product.pop("catalogPreview", None)
            continue

        rel_paths = write_gallery(slug, selected)
        product["images"] = rel_paths
        product["catalogPreview"] = f"/products/{slug}/catalog-preview.png"

    PRODUCTS_PATH.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("products.json updated")


if __name__ == "__main__":
    main()
