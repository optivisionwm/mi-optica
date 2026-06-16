import cv2
import numpy as np

img = cv2.imread('assets/lens-photo.jpg')
h, w, _ = img.shape

# Left Lens (held by fingers)
left_lens = [
    (0.518, 0.292),
    (0.535, 0.288),
    (0.555, 0.288),
    (0.575, 0.295),
    (0.595, 0.310),
    (0.610, 0.330),
    (0.620, 0.355),
    (0.623, 0.380),
    (0.620, 0.405),
    (0.612, 0.430),
    (0.598, 0.455),
    (0.582, 0.475),
    (0.565, 0.490),
    (0.548, 0.500),
    (0.530, 0.500),
    (0.512, 0.492),
    (0.495, 0.475),
    (0.482, 0.455),
    (0.475, 0.435),
    (0.472, 0.410),
    (0.475, 0.385),
    (0.482, 0.360),
    (0.495, 0.330),
    (0.505, 0.310)
]

# Right Lens (over eye)
right_lens = [
    (0.720, 0.380),
    (0.735, 0.378),
    (0.755, 0.382),
    (0.775, 0.395),
    (0.795, 0.415),
    (0.810, 0.440),
    (0.820, 0.465),
    (0.824, 0.495),
    (0.820, 0.525),
    (0.810, 0.550),
    (0.795, 0.570),
    (0.775, 0.585),
    (0.755, 0.592),
    (0.735, 0.592),
    (0.715, 0.585),
    (0.695, 0.570),
    (0.680, 0.550),
    (0.668, 0.525),
    (0.665, 0.495),
    (0.668, 0.465),
    (0.675, 0.440),
    (0.688, 0.415),
    (0.702, 0.395)
]

def to_px(pts):
    return np.array([[int(x * w), int(y * h)] for x, y in pts], dtype=np.int32)

left_px = to_px(left_lens)
right_px = to_px(right_lens)

overlay = img.copy()
cv2.fillPoly(overlay, [left_px], (0, 255, 0))
cv2.fillPoly(overlay, [right_px], (0, 255, 255))
out = cv2.addWeighted(img, 0.5, overlay, 0.5, 0)

# Draw poly lines to see exact bounds
cv2.polylines(out, [left_px], True, (0, 255, 0), 2)
cv2.polylines(out, [right_px], True, (0, 255, 255), 2)

cv2.imwrite('assets/debug_exact_1.jpg', out)

def to_svg(pts):
    d = ""
    for i, (x, y) in enumerate(pts):
        cmd = "M" if i == 0 else " L"
        d += f"{cmd} {x:.4f} {y:.4f}"
    d += " Z"
    return d

print("=== SVG PATHS ===")
print(f'LEFT:  <path d="{to_svg(left_lens)}" />')
print()
print(f'RIGHT: <path d="{to_svg(right_lens)}" />')
