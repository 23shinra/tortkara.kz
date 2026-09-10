#!/usr/bin/env python3
"""Cut product photos to transparent 1600x1200 catalog previews."""

from __future__ import annotations

from pathlib import Path

from collections import deque
from PIL import Image, ImageDraw, ImageFilter
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
CANVAS = (1600, 1200)
PAD = 48

SOURCES = {
    "xcmg-xr160": "public/products/xcmg-xr160/source-preview.jpg",
    "xcmg-xr200": "public/products/xcmg-xr200/source-preview.jpg",
    "xcmg-xr220": "public/products/xcmg-xr220/source-preview.jpg",
    "xcmg-xr240": "public/products/xcmg-xr240/source-preview.jpg",
    "xcmg-xr280": "public/products/xcmg-xr280/source-preview.jpg",
    "xcmg-xr360": "public/products/xcmg-xr360/source-preview.jpg",
    "xcmg-xr400": "public/products/xcmg-xr400/source-preview.jpg",
    "xcmg-xr1050": "public/products/xcmg-xr1050/source-preview.jpg",
    "bauer-bg25": "public/products/bauer-bg25/source-preview.jpg",
    "bauer-bg26": "public/products/bauer-bg26/source-preview.jpg",
    "bauer-bg30": "public/products/bauer-bg30/source-preview.jpg",
    "bauer-bg36": "public/products/bauer-bg36/source-preview.jpg",
    "sany-sr285": "public/products/sany-sr285/source-preview.jpg",
}

# Soft-hide conflicting model badges without inventing new text.
# Regions are relative fractions of the cutout bbox (x, y, w, h).
HIDE_BADGES: dict[str, list[tuple[float, float, float, float]]] = {
    # XR220D badge on side panel
    "xcmg-xr220": [(0.42, 0.38, 0.22, 0.08)],
    # XR280E / similar side badge
    "xcmg-xr280": [(0.40, 0.36, 0.24, 0.10)],
    # SR285R side badge
    "sany-sr285": [(0.38, 0.42, 0.28, 0.10)],
}


def downscale(img: Image.Image, max_side: int = 2000) -> Image.Image:
    w, h = img.size
    scale = min(1.0, max_side / max(w, h))
    if scale >= 1:
        return img
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def crop_non_white_background(img: Image.Image, threshold: int = 245) -> Image.Image:
    """Trim oversized white margins from source photos."""
    gray = img.convert("L")
    mask = Image.eval(gray, lambda v: 255 if v < threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    if (x1 - x0) * (y1 - y0) < 30_000:
        return img
    pad = 24
    return img.crop(
        (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(img.width, x1 + pad),
            min(img.height, y1 + pad),
        )
    )


def alpha_bbox(img: Image.Image, threshold: int = 8) -> tuple[int, int, int, int]:
    alpha = img.split()[-1]
    mask = alpha.point(lambda p: 255 if p > threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return (0, 0, img.width, img.height)
    return bbox


def keep_largest_component(cutout: Image.Image, threshold: int = 72) -> Image.Image:
    """Remove rembg haze and keep only the main machine silhouette."""
    rgba = cutout.convert("RGBA")
    alpha = rgba.split()[-1]
    w, h = alpha.size
    data = list(alpha.getdata())

    def idx(x: int, y: int) -> int:
        return y * w + x

    visited = [False] * (w * h)
    best_component: list[int] = []

    for y in range(h):
        for x in range(w):
            i = idx(x, y)
            if visited[i] or data[i] < threshold:
                continue
            q = deque([i])
            visited[i] = True
            component: list[int] = []
            while q:
                cur = q.popleft()
                component.append(cur)
                cx, cy = cur % w, cur // w
                for nx, ny in (
                    (cx - 1, cy),
                    (cx + 1, cy),
                    (cx, cy - 1),
                    (cx, cy + 1),
                ):
                    if 0 <= nx < w and 0 <= ny < h:
                        ni = idx(nx, ny)
                        if not visited[ni] and data[ni] >= threshold:
                            visited[ni] = True
                            q.append(ni)
            if len(component) > len(best_component):
                best_component = component

    if not best_component:
        return rgba

    mask = Image.new("L", (w, h), 0)
    m = mask.load()
    for i in best_component:
        m[i % w, i // w] = 255

    # Recover soft antialiasing on the edge while keeping inside opaque.
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    cleaned = rgba.copy()
    cleaned.putalpha(mask)
    return cleaned


def soft_hide_badge(img: Image.Image, regions: list[tuple[float, float, float, float]]) -> Image.Image:
    """Clone nearby paint over badge rectangles using neighboring colors."""
    out = img.copy()
    bw, bh = out.size
    for rx, ry, rw, rh in regions:
        x0 = int(rx * bw)
        y0 = int(ry * bh)
        x1 = min(bw, int((rx + rw) * bw))
        y1 = min(bh, int((ry + rh) * bh))
        if x1 <= x0 or y1 <= y0:
            continue
        # Sample a strip above the badge for fill color
        sample_y0 = max(0, y0 - max(8, (y1 - y0)))
        sample = out.crop((x0, sample_y0, x1, y0 if y0 > sample_y0 else min(bh, y0 + 4)))
        if sample.width == 0 or sample.height == 0:
            continue
        # Average opaque pixels
        pixels = list(sample.getdata())
        opaque = [p for p in pixels if len(p) == 4 and p[3] > 40]
        if not opaque:
            continue
        r = sum(p[0] for p in opaque) // len(opaque)
        g = sum(p[1] for p in opaque) // len(opaque)
        b = sum(p[2] for p in opaque) // len(opaque)
        a = sum(p[3] for p in opaque) // len(opaque)
        patch = Image.new("RGBA", (x1 - x0, y1 - y0), (r, g, b, a))
        # Soft edge mask
        mask = Image.new("L", patch.size, 0)
        draw = ImageDraw.Draw(mask)
        inset = max(2, min(patch.size) // 8)
        draw.rounded_rectangle(
            [inset, inset, patch.width - inset - 1, patch.height - inset - 1],
            radius=max(4, inset),
            fill=220,
        )
        mask = mask.filter(ImageFilter.GaussianBlur(radius=max(2, inset)))
        out.paste(patch, (x0, y0), mask)
    return out


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


def process(slug: str, src_rel: str) -> Path:
    src = ROOT / src_rel
    if not src.exists():
        raise FileNotFoundError(src)
    print(f"[{slug}] load {src}")
    img = Image.open(src).convert("RGBA")
    img = crop_non_white_background(img)
    img = downscale(img)
    print(f"[{slug}] rembg…")
    cut = keep_largest_component(remove(img))
    if slug in HIDE_BADGES:
        # Apply hide on the cutout before canvas fit, using cutout-local coords
        bbox = alpha_bbox(cut)
        subject = cut.crop(bbox)
        subject = soft_hide_badge(subject, HIDE_BADGES[slug])
        rebuilt = Image.new("RGBA", cut.size, (0, 0, 0, 0))
        rebuilt.paste(subject, (bbox[0], bbox[1]), subject)
        cut = rebuilt
    preview = fit_on_canvas(cut)
    out = ROOT / "public" / "products" / slug / "catalog-preview.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    preview.save(out, optimize=True)
    print(f"[{slug}] -> {out} ({out.stat().st_size // 1024} KB)")
    return out


def main() -> None:
    for slug, src in SOURCES.items():
        process(slug, src)
    print("ALL DONE")


if __name__ == "__main__":
    main()
