import cv2
import numpy as np

img = cv2.imread('assets/lens-photo.jpg')
h, w, _ = img.shape

# Initial rough estimates based on visual inspection
# Left Lens (held by fingers)
left_cx, left_cy = 0.548, 0.395
left_rx, left_ry = 0.075, 0.105

# Right Lens (over eye)
right_cx, right_cy = 0.745, 0.485
right_rx, right_rx2 = 0.075, 0.070
right_ry, right_ry2 = 0.105, 0.100

def create_ellipse_path(cx, cy, rx, ry, num_points=32):
    pts = []
    for i in range(num_points):
        angle = 2 * np.pi * i / num_points
        x = cx + rx * np.cos(angle)
        y = cy + ry * np.sin(angle)
        pts.append((x, y))
    return pts

left_pts = create_ellipse_path(left_cx, left_cy, left_rx, left_ry)
right_pts = create_ellipse_path(right_cx, right_cy, right_rx, right_ry)

def to_px(pts):
    return np.array([[int(x * w), int(y * h)] for x, y in pts], dtype=np.int32)

left_px = to_px(left_pts)
right_px = to_px(right_pts)

overlay = img.copy()
cv2.fillPoly(overlay, [left_px], (0, 255, 0))
cv2.fillPoly(overlay, [right_px], (0, 255, 255))
out = cv2.addWeighted(img, 0.5, overlay, 0.5, 0)

# Draw a grid to help fine-tune
for i in range(10, 90, 5):
    x = int(i * w / 100)
    cv2.line(out, (x, 0), (x, h), (255, 255, 255), 1)
    if i % 10 == 0:
        cv2.putText(out, f'.{i}', (x+2, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        
for i in range(20, 80, 5):
    y = int(i * h / 100)
    cv2.line(out, (0, y), (w, y), (255, 255, 255), 1)
    if i % 10 == 0:
        cv2.putText(out, f'.{i}', (2, y-2), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

cv2.imwrite('assets/debug_correct_1.jpg', out)
print("Saved assets/debug_correct_1.jpg")
