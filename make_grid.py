import cv2
import numpy as np

img = cv2.imread('assets/lens-sunset-1.jpg')
h, w, _ = img.shape
grid_img = img.copy()

step_x = w // 20
step_y = h // 20

for x in range(0, w, step_x):
    cv2.line(grid_img, (x, 0), (x, h), (0, 255, 0), 1)
    cv2.putText(grid_img, f'{x/w:.2f}', (x+2, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

for y in range(0, h, step_y):
    cv2.line(grid_img, (0, y), (w, y), (0, 255, 0), 1)
    cv2.putText(grid_img, f'{y/h:.2f}', (2, y+15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

cv2.imwrite('assets/grid_lens.jpg', grid_img)
