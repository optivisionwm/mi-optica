from __future__ import annotations

import argparse
import html
import json
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image
from skimage import measure


@dataclass(frozen=True)
class LogoPart:
    name: str
    label: str
    color: tuple[int, int, int]


PARTS = (
    LogoPart("glasses", "Gafas", (217, 217, 217)),
    LogoPart("optivision", "OPTIVISION", (228, 193, 157)),
    LogoPart("wm", "W&M", (228, 193, 157)),
)


def find_bands(mask: np.ndarray) -> list[tuple[int, int]]:
    active_rows = np.flatnonzero(mask.any(axis=1))
    if active_rows.size == 0:
        return []

    bands: list[tuple[int, int]] = []
    start = previous = int(active_rows[0])
    for row in active_rows[1:]:
        row = int(row)
        if row > previous + 1:
            bands.append((start, previous + 1))
            start = row
        previous = row
    bands.append((start, previous + 1))
    return bands


def contour_path(alpha: np.ndarray, tolerance: float = 0.7) -> str:
    contours = measure.find_contours(
        alpha,
        level=0.5,
        fully_connected="high",
        positive_orientation="high",
    )
    commands: list[str] = []

    for contour in contours:
        simplified = measure.approximate_polygon(contour, tolerance=tolerance)
        if len(simplified) < 4:
            continue

        points = [(float(point[1]), float(point[0])) for point in simplified]
        if points[0] != points[-1]:
            points.append(points[0])

        commands.append(f"M {points[0][0]:.2f} {points[0][1]:.2f}")
        commands.extend(f"L {x:.2f} {y:.2f}" for x, y in points[1:])
        commands.append("Z")

    return " ".join(commands)


def write_svg(
    output_path: Path,
    part: LogoPart,
    width: int,
    height: int,
    path_data: str,
    source_box: tuple[int, int, int, int],
) -> None:
    color = "#{:02X}{:02X}{:02X}".format(*part.color)
    x, y, _, _ = source_box
    title = html.escape(f"{part.label} - Optivision W&M")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">
  <title id="title">{title}</title>
  <path d="{path_data}" fill="{color}" fill-rule="evenodd" clip-rule="evenodd" data-source-x="{x}" data-source-y="{y}"/>
</svg>
'''
    output_path.write_text(svg, encoding="ascii")


def main() -> None:
    parser = argparse.ArgumentParser(description="Separate and vectorize the Optivision logo.")
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    source = Image.open(args.source).convert("RGB")
    pixels = np.asarray(source, dtype=np.float32)
    foreground = pixels.max(axis=2) > 8
    bands = find_bands(foreground)
    if len(bands) != len(PARTS):
        raise RuntimeError(f"Expected 3 logo bands, found {len(bands)}: {bands}")

    vector_dir = args.output / "vector"
    raster_dir = args.output / "raster"
    vector_dir.mkdir(parents=True, exist_ok=True)
    raster_dir.mkdir(parents=True, exist_ok=True)

    manifest: dict[str, object] = {
        "source": args.source.name,
        "sourceSize": {"width": source.width, "height": source.height},
        "parts": [],
    }
    padding = 12

    for part, (band_top, band_bottom) in zip(PARTS, bands, strict=True):
        band_mask = foreground[band_top:band_bottom]
        active_columns = np.flatnonzero(band_mask.any(axis=0))
        left = max(0, int(active_columns[0]) - padding)
        right = min(source.width, int(active_columns[-1]) + 1 + padding)
        top = max(0, band_top - padding)
        bottom = min(source.height, band_bottom + padding)

        crop = pixels[top:bottom, left:right]
        target = np.asarray(part.color, dtype=np.float32)
        alpha = np.clip(crop.max(axis=2) / target.max(), 0.0, 1.0)
        alpha[crop.max(axis=2) <= 8] = 0.0

        rgba = np.empty((*alpha.shape, 4), dtype=np.uint8)
        rgba[:, :, :3] = np.asarray(part.color, dtype=np.uint8)
        rgba[:, :, 3] = np.round(alpha * 255).astype(np.uint8)
        Image.fromarray(rgba, mode="RGBA").save(raster_dir / f"{part.name}.png")

        path_data = contour_path(alpha)
        if not path_data:
            raise RuntimeError(f"No vector contours generated for {part.name}")

        width = right - left
        height = bottom - top
        source_box = (left, top, right, bottom)
        write_svg(
            vector_dir / f"{part.name}.svg",
            part,
            width,
            height,
            path_data,
            source_box,
        )

        manifest["parts"].append(
            {
                "name": part.name,
                "label": part.label,
                "color": "#{:02X}{:02X}{:02X}".format(*part.color),
                "sourceBox": {"x": left, "y": top, "width": width, "height": height},
                "vector": f"vector/{part.name}.svg",
                "raster": f"raster/{part.name}.png",
            }
        )

    (args.output / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=True) + "\n",
        encoding="ascii",
    )


if __name__ == "__main__":
    main()
