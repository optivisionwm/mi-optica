import cv2
import numpy as np

img = cv2.imread('assets/lens-photo.jpg')
h, w, _ = img.shape

# ============================================================
# v4 - AJUSTE FINAL 
# Cristal izq: OK, micro-ajustes menores
# Cristal der: contraer superiormente 1-2%, contraer derecha 1%
# ============================================================

left_lens = [
    (0.357, 0.413),
    (0.367, 0.398),
    (0.382, 0.385),
    (0.400, 0.374),
    (0.418, 0.365),
    (0.435, 0.362),
    (0.450, 0.366),
    (0.465, 0.374),
    (0.478, 0.386),
    (0.488, 0.400),
    (0.496, 0.418),
    (0.502, 0.438),
    (0.504, 0.460),
    (0.502, 0.480),
    (0.496, 0.498),
    (0.488, 0.515),
    (0.478, 0.530),
    (0.465, 0.543),
    (0.450, 0.552),
    (0.435, 0.556),
    (0.418, 0.552),
    (0.400, 0.543),
    (0.382, 0.530),
    (0.367, 0.515),
    (0.357, 0.498),
    (0.350, 0.480),
    (0.347, 0.460),
    (0.349, 0.438),
]

right_lens = [
    (0.562, 0.395),
    (0.575, 0.378),
    (0.590, 0.364),
    (0.608, 0.352),
    (0.628, 0.342),
    (0.648, 0.337),
    (0.668, 0.337),
    (0.685, 0.342),
    (0.702, 0.352),
    (0.716, 0.365),
    (0.726, 0.382),
    (0.734, 0.400),
    (0.739, 0.422),
    (0.741, 0.448),
    (0.739, 0.472),
    (0.734, 0.494),
    (0.726, 0.513),
    (0.716, 0.530),
    (0.702, 0.545),
    (0.685, 0.556),
    (0.668, 0.563),
    (0.648, 0.566),
    (0.628, 0.562),
    (0.608, 0.554),
    (0.590, 0.543),
    (0.575, 0.528),
    (0.562, 0.510),
    (0.554, 0.488),
    (0.549, 0.465),
    (0.549, 0.440),
    (0.552, 0.420),
    (0.556, 0.406),
]

def norm_to_px(pts):
    return np.array([[int(x * w), int(y * h)] for x, y in pts], dtype=np.int32)

left_px = norm_to_px(left_lens)
right_px = norm_to_px(right_lens)

overlay = img.copy()
cv2.fillPoly(overlay, [left_px], (0, 120, 0))
cv2.fillPoly(overlay, [right_px], (0, 120, 120))
debug = cv2.addWeighted(img, 0.5, overlay, 0.5, 0)
cv2.polylines(debug, [left_px], True, (0, 255, 0), 2)
cv2.polylines(debug, [right_px], True, (0, 255, 255), 2)
cv2.imwrite('assets/debug_v4.jpg', debug)

def to_svg(pts):
    d = ""
    for i, (x, y) in enumerate(pts):
        cmd = "M" if i == 0 else " L"
        d += f"{cmd} {x:.4f} {y:.4f}"
    d += " Z"
    return d

print("=== SVG PATHS v4 ===")
print(f'LEFT:  <path d="{to_svg(left_lens)}" />')
print()
print(f'RIGHT: <path d="{to_svg(right_lens)}" />')
