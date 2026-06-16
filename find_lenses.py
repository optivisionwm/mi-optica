import cv2
import numpy as np

img = cv2.imread('assets/lens-sunset-1.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
h, w = gray.shape

# The lenses are the bright sunset. The frame is very dark.
# Let's use a simple threshold.
_, thresh = cv2.threshold(gray, 50, 255, cv2.THRESH_BINARY)

# Find contours of the bright regions
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Create an output image to visualize what we found
out_img = img.copy()

lenses = []
for cnt in contours:
    area = cv2.contourArea(cnt)
    # The lenses are quite large. Area > 2% of image and < 40% of image.
    if (w * h * 0.02) < area < (w * h * 0.40):
        # Additional check: Should be roughly in the middle vertically
        x, y, cw, ch = cv2.boundingRect(cnt)
        cy = y + ch/2
        if 0.2 * h < cy < 0.8 * h:
            lenses.append(cnt)

# Sort left to right
lenses = sorted(lenses, key=lambda c: cv2.boundingRect(c)[0])

print(f"Found {len(lenses)} possible lenses.")

cv2.drawContours(out_img, lenses, -1, (0, 255, 0), 3)
cv2.imwrite('assets/lens_contours.jpg', out_img)

for cnt in lenses[:2]:
    # Smooth the contour
    epsilon = 0.005 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    
    path_str = ""
    for i, point in enumerate(approx):
        px, py = point[0]
        nx = px / w
        ny = py / h
        if i == 0:
            path_str += f"M {nx:.4f} {ny:.4f} "
        else:
            path_str += f"L {nx:.4f} {ny:.4f} "
    path_str += "Z"
    print(f'<path d="{path_str}" />')
