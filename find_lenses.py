import cv2
import numpy as np

img = cv2.imread('assets/lens-photo.jpg')
h, w, _ = img.shape
print(f"Imagen: {w}x{h}")

# ============================================================
# GRID ULTRA DETALLADA - 50 divisiones
# ============================================================
grid = img.copy()
for i in range(51):
    x = int(i * w / 50)
    y = int(i * h / 50)
    if x < w:
        cv2.line(grid, (x, 0), (x, h), (0, 255, 0), 1)
        if i % 2 == 0:
            cv2.putText(grid, f'{i/50:.2f}', (x+1, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (255, 255, 255), 1)
    if y < h:
        cv2.line(grid, (0, y), (w, y), (0, 255, 0), 1)
        if i % 2 == 0:
            cv2.putText(grid, f'{i/50:.2f}', (1, y+12), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (255, 255, 255), 1)

# Superponer bordes Canny en rojo
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (3, 3), 1)
edges = cv2.Canny(blurred, 40, 120)
grid[edges > 0] = [0, 0, 255]

cv2.imwrite('assets/debug_grid_new.jpg', grid)

# ============================================================
# DETECCION AUTOMATICA con el marco metalico dorado
# El marco es dorado (alto en canal R y G, bajo en B)
# ============================================================
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# El marco dorado: Hue entre ~15-35, saturacion media-alta, brillo medio-alto
# Crear mascara del marco metalico
lower_gold = np.array([12, 40, 100])
upper_gold = np.array([35, 255, 255])
gold_mask = cv2.inRange(hsv, lower_gold, upper_gold)

# Dilatar para cerrar el marco
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
gold_closed = cv2.morphologyEx(gold_mask, cv2.MORPH_CLOSE, kernel, iterations=5)
gold_closed = cv2.morphologyEx(gold_closed, cv2.MORPH_DILATE, kernel, iterations=2)

cv2.imwrite('assets/debug_gold_mask.jpg', gold_closed)

# Invertir: las regiones NO-doradas que esten ENCERRADAS por el marco son cristales
inv = cv2.bitwise_not(gold_closed)

# Flood fill desde bordes para quitar fondo
flood = inv.copy()
flood_mask = np.zeros((h + 2, w + 2), np.uint8)
for x in range(0, w, 3):
    if flood[0, x] == 255:
        cv2.floodFill(flood, flood_mask, (x, 0), 0)
    if flood[h-1, x] == 255:
        cv2.floodFill(flood, flood_mask, (x, h-1), 0)
for y in range(0, h, 3):
    if flood[y, 0] == 255:
        cv2.floodFill(flood, flood_mask, (0, y), 0)
    if flood[y, w-1] == 255:
        cv2.floodFill(flood, flood_mask, (w-1, y), 0)

# Limpiar
kernel_clean = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
flood = cv2.morphologyEx(flood, cv2.MORPH_OPEN, kernel_clean, iterations=2)
flood = cv2.morphologyEx(flood, cv2.MORPH_CLOSE, kernel_clean, iterations=3)

cv2.imwrite('assets/debug_flood_new.jpg', flood)

# Encontrar contornos
contours, _ = cv2.findContours(flood, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

candidates = []
for cnt in contours:
    area = cv2.contourArea(cnt)
    area_ratio = area / (w * h)
    x, y, cw, ch = cv2.boundingRect(cnt)
    cx = (x + cw / 2) / w
    cy = (y + ch / 2) / h
    if area_ratio > 0.005:
        print(f"  Contorno: area={area_ratio:.4f}, center=({cx:.3f},{cy:.3f}), size=({cw}x{ch})")
    if area_ratio > 0.015:
        candidates.append((cnt, area, cx, cy))

candidates = sorted(candidates, key=lambda x: x[1], reverse=True)[:2]
candidates = sorted(candidates, key=lambda x: x[2])

print(f"\nCristales encontrados: {len(candidates)}")

# Generar paths y debug
debug = img.copy()
overlay = img.copy()
svg_paths = []

for idx, (cnt, area, cx, cy) in enumerate(candidates):
    perimeter = cv2.arcLength(cnt, True)
    epsilon = 0.003 * perimeter
    smoothed = cv2.approxPolyDP(cnt, epsilon, True)
    
    color = (0, 255, 0) if idx == 0 else (0, 255, 255)
    cv2.drawContours(debug, [smoothed], -1, color, 2)
    cv2.fillPoly(overlay, [smoothed], (0, 100, 0) if idx == 0 else (0, 100, 100))
    
    path_d = ""
    for i, pt in enumerate(smoothed):
        px, py = pt[0]
        nx = round(px / w, 4)
        ny = round(py / h, 4)
        cmd = "M" if i == 0 else " L"
        path_d += f"{cmd} {nx} {ny}"
    path_d += " Z"
    svg_paths.append(path_d)
    
    x, y, cw, ch = cv2.boundingRect(cnt)
    print(f"  Cristal {idx+1}: {len(smoothed)} pts, bbox=({x/w:.3f},{y/h:.3f},{cw/w:.3f},{ch/h:.3f})")
    print(f'  <path d="{path_d}" />')

debug_filled = cv2.addWeighted(img, 0.55, overlay, 0.45, 0)
cv2.polylines(debug_filled, [cv2.approxPolyDP(c[0], 0.003 * cv2.arcLength(c[0], True), True) for c in candidates], True, (0, 255, 0), 2)

cv2.imwrite('assets/debug_new_outline.jpg', debug)
cv2.imwrite('assets/debug_new_filled.jpg', debug_filled)
print("Debug guardado")
