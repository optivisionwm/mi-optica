import cv2
import numpy as np

img = cv2.imread('assets/lens-sunset-1.jpg')
h, w, _ = img.shape

# Crear grid ultra-detallada (40 divisiones) con marcadores en los bordes del marco
grid = img.copy()

# Grid fina
for i in range(41):
    x = int(i * w / 40)
    y = int(i * h / 40)
    if x < w:
        cv2.line(grid, (x, 0), (x, h), (0, 255, 0), 1)
        cv2.putText(grid, f'{i/40:.2f}', (x+1, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1)
    if y < h:
        cv2.line(grid, (0, y), (w, y), (0, 255, 0), 1)
        cv2.putText(grid, f'{i/40:.2f}', (1, y+12), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1)

# Superponer en la imagen los BORDES detectados por Canny (solo los más fuertes)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (3, 3), 1)
edges = cv2.Canny(blurred, 50, 120)

# Colorear los bordes en rojo sobre el grid
grid[edges > 0] = [0, 0, 255]

cv2.imwrite('assets/debug_grid_edges.jpg', grid)

# También crear una versión con SOLO la zona central (donde están los lentes)
# Recortar verticalmente: 0.25h a 0.85h, horizontalmente: 0.05w a 0.98w
y1, y2 = int(0.25*h), int(0.85*h)
x1, x2 = int(0.05*w), int(0.98*w)
cropped = grid[y1:y2, x1:x2]
cv2.imwrite('assets/debug_grid_edges_crop.jpg', cropped)

print(f"Grid con bordes guardado. Imagen={w}x{h}")
print(f"Crop zone: ({x1},{y1}) to ({x2},{y2})")
