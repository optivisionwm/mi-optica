import cv2
import numpy as np

img = cv2.imread('assets/lens-photo.jpg')
h, w, _ = img.shape

left_lens = [
    (0.518, 0.292), (0.535, 0.288), (0.555, 0.288), (0.575, 0.295),
    (0.595, 0.310), (0.610, 0.330), (0.620, 0.355), (0.623, 0.380),
    (0.620, 0.405), (0.612, 0.430), (0.598, 0.455), (0.582, 0.475),
    (0.565, 0.490), (0.548, 0.500), (0.530, 0.500), (0.512, 0.492),
    (0.495, 0.475), (0.482, 0.455), (0.475, 0.435), (0.472, 0.410),
    (0.475, 0.385), (0.482, 0.360), (0.495, 0.330), (0.505, 0.310)
]

right_lens = [
    (0.720, 0.380), (0.735, 0.378), (0.755, 0.382), (0.775, 0.395),
    (0.795, 0.415), (0.810, 0.440), (0.820, 0.465), (0.824, 0.495),
    (0.820, 0.525), (0.810, 0.550), (0.795, 0.570), (0.775, 0.585),
    (0.755, 0.592), (0.735, 0.592), (0.715, 0.585), (0.695, 0.570),
    (0.680, 0.550), (0.668, 0.525), (0.665, 0.495), (0.668, 0.465),
    (0.675, 0.440), (0.688, 0.415), (0.702, 0.395)
]

def to_px(pts):
    return np.array([[int(x * w), int(y * h)] for x, y in pts], dtype=np.int32)

left_px = to_px(left_lens)
right_px = to_px(right_lens)

overlay = img.copy()
cv2.fillPoly(overlay, [left_px], (0, 255, 0))
cv2.fillPoly(overlay, [right_px], (0, 255, 255))
out = cv2.addWeighted(img, 0.6, overlay, 0.4, 0)
cv2.polylines(out, [left_px], True, (0, 255, 0), 1)
cv2.polylines(out, [right_px], True, (0, 255, 255), 1)

# Draw fine grid over left lens
# x from 0.46 to 0.64
# y from 0.28 to 0.52
for i in range(460, 640, 5):
    x = int((i/1000.0) * w)
    c = (255,255,255) if i % 20 == 0 else (150,150,150)
    cv2.line(out, (x, int(0.28*h)), (x, int(0.52*h)), c, 1)
    if i % 10 == 0:
        cv2.putText(out, f'.{i}', (x+1, int(0.29*h)), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255,255,255), 1)

for i in range(280, 520, 5):
    y = int((i/1000.0) * h)
    c = (255,255,255) if i % 20 == 0 else (150,150,150)
    cv2.line(out, (int(0.46*w), y), (int(0.64*w), y), c, 1)
    if i % 10 == 0:
        cv2.putText(out, f'.{i}', (int(0.465*w), y-2), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255,255,255), 1)

# Draw fine grid over right lens
# x from 0.65 to 0.84
# y from 0.36 to 0.60
for i in range(650, 840, 5):
    x = int((i/1000.0) * w)
    c = (255,255,255) if i % 20 == 0 else (150,150,150)
    cv2.line(out, (x, int(0.36*h)), (x, int(0.60*h)), c, 1)
    if i % 10 == 0:
        cv2.putText(out, f'.{i}', (x+1, int(0.37*h)), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255,255,255), 1)

for i in range(360, 600, 5):
    y = int((i/1000.0) * h)
    c = (255,255,255) if i % 20 == 0 else (150,150,150)
    cv2.line(out, (int(0.65*w), y), (int(0.84*w), y), c, 1)
    if i % 10 == 0:
        cv2.putText(out, f'.{i}', (int(0.655*w), y-2), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255,255,255), 1)

# Highlight edge pixels using Canny to find the absolute exact metallic frame
edges = cv2.Canny(img, 50, 150)
out[edges > 0] = [0, 0, 255] # Red edges

# Crop to lenses to zoom in
crop_left = out[int(0.28*h):int(0.52*h), int(0.46*w):int(0.64*w)]
crop_right = out[int(0.36*h):int(0.60*h), int(0.65*w):int(0.84*w)]

cv2.imwrite('assets/debug_refine_left.jpg', crop_left)
cv2.imwrite('assets/debug_refine_right.jpg', crop_right)
print("Saved zoomed debug grids")
