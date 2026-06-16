import cv2
import numpy as np
import re

img = cv2.imread('assets/lens-photo.jpg')
h, w, _ = img.shape

path_left = "M 0.3570 0.4130 L 0.3670 0.3980 L 0.3820 0.3850 L 0.4000 0.3740 L 0.4180 0.3650 L 0.4350 0.3620 L 0.4500 0.3660 L 0.4650 0.3740 L 0.4780 0.3860 L 0.4880 0.4000 L 0.4960 0.4180 L 0.5020 0.4380 L 0.5040 0.4600 L 0.5020 0.4800 L 0.4960 0.4980 L 0.4880 0.5150 L 0.4780 0.5300 L 0.4650 0.5430 L 0.4500 0.5520 L 0.4350 0.5560 L 0.4180 0.5520 L 0.4000 0.5430 L 0.3820 0.5300 L 0.3670 0.5150 L 0.3570 0.4980 L 0.3500 0.4800 L 0.3470 0.4600 L 0.3490 0.4380 Z"
path_right = "M 0.5620 0.3950 L 0.5750 0.3780 L 0.5900 0.3640 L 0.6080 0.3520 L 0.6280 0.3420 L 0.6480 0.3370 L 0.6680 0.3370 L 0.6850 0.3420 L 0.7020 0.3520 L 0.7160 0.3650 L 0.7260 0.3820 L 0.7340 0.4000 L 0.7390 0.4220 L 0.7410 0.4480 L 0.7390 0.4720 L 0.7340 0.4940 L 0.7260 0.5130 L 0.7160 0.5300 L 0.7020 0.5450 L 0.6850 0.5560 L 0.6680 0.5630 L 0.6480 0.5660 L 0.6280 0.5620 L 0.6080 0.5540 L 0.5900 0.5430 L 0.5750 0.5280 L 0.5620 0.5100 L 0.5540 0.4880 L 0.5490 0.4650 L 0.5490 0.4400 L 0.5520 0.4200 L 0.5560 0.4060 Z"

def parse_path(path_str):
    pts = []
    # Find all floats
    numbers = re.findall(r'[0-9.]+', path_str)
    for i in range(0, len(numbers), 2):
        x = float(numbers[i]) * w
        y = float(numbers[i+1]) * h
        pts.append([int(x), int(y)])
    return np.array(pts, np.int32)

pts_left = parse_path(path_left)
pts_right = parse_path(path_right)

overlay = img.copy()
cv2.fillPoly(overlay, [pts_left], (0, 0, 255))
cv2.fillPoly(overlay, [pts_right], (0, 0, 255))

out = cv2.addWeighted(img, 0.5, overlay, 0.5, 0)
cv2.imwrite('assets/debug_verify.jpg', out)
print("Verification written to debug_verify.jpg")
