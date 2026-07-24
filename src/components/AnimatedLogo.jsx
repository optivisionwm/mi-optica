import React, { useEffect, useState } from 'react';

export default function AnimatedLogo({ src, className = '', id, alt, type = 'nav' }) {
    const [logoData, setLogoData] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        
        img.onload = () => {
            try {
                const width = img.width;
                const height = img.height;
                const cvs = document.createElement('canvas');
                cvs.width = width;
                cvs.height = height;
                const ctx = cvs.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;
                const visited = new Uint8Array(width * height);
                const components = [];
                
                // Paso 1: Flood Fill para encontrar cada letra/forma separada (islas de píxeles)
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const idx = y * width + x;
                        if (visited[idx]) continue;
                        
                        if (data[idx * 4 + 3] > 2) { // Mayor a 2 captura casi todo el anti-aliasing
                            const comp = { minX: x, maxX: x, minY: y, maxY: y, pixels: [] };
                            const queue = [idx];
                            visited[idx] = 1;
                            
                            let head = 0;
                            while (head < queue.length) {
                                const currIdx = queue[head++];
                                const cx = currIdx % width;
                                const cy = Math.floor(currIdx / width);
                                
                                comp.pixels.push(currIdx);
                                
                                if (cx < comp.minX) comp.minX = cx;
                                if (cx > comp.maxX) comp.maxX = cx;
                                if (cy < comp.minY) comp.minY = cy;
                                if (cy > comp.maxY) comp.maxY = cy;
                                
                                // Revisar 8 vecinos
                                const neighbors = [
                                    currIdx - 1, currIdx + 1,
                                    currIdx - width, currIdx + width,
                                    currIdx - width - 1, currIdx - width + 1,
                                    currIdx + width - 1, currIdx + width + 1
                                ];
                                
                                for (let i = 0; i < 8; i++) {
                                    const nIdx = neighbors[i];
                                    if (nIdx >= 0 && nIdx < data.length / 4) {
                                        const nx = nIdx % width;
                                        if (Math.abs(nx - cx) > 1) continue; 
                                        if (!visited[nIdx] && data[nIdx * 4 + 3] > 2) {
                                            visited[nIdx] = 1;
                                            queue.push(nIdx);
                                        }
                                    }
                                }
                            }
                            
                            // Ignorar puntos minúsculos de ruido
                            if (comp.pixels.length > 5) {
                                components.push(comp);
                            }
                        }
                    }
                }
                
                // Paso 2: Ordenar de arriba a abajo, izquierda a derecha para efecto ola progresivo
                components.sort((a, b) => {
                    if (Math.abs(a.minY - b.minY) > 20) {
                        return a.minY - b.minY; 
                    }
                    return a.minX - b.minX;
                });
                
                // Paso 3: Extraer cada componente en su propia miniatura
                const extracted = components.map((comp, i) => {
                    const compW = comp.maxX - comp.minX + 1;
                    const compH = comp.maxY - comp.minY + 1;
                    
                    const tCvs = document.createElement('canvas');
                    tCvs.width = compW;
                    tCvs.height = compH;
                    const tCtx = tCvs.getContext('2d');
                    const tImgData = tCtx.createImageData(compW, compH);
                    
                    comp.pixels.forEach(currIdx => {
                        const cx = currIdx % width;
                        const cy = Math.floor(currIdx / width);
                        
                        const localX = cx - comp.minX;
                        const localY = cy - comp.minY;
                        
                        const localIdx = (localY * compW + localX) * 4;
                        const globalIdx = currIdx * 4;
                        
                        tImgData.data[localIdx] = data[globalIdx];
                        tImgData.data[localIdx + 1] = data[globalIdx + 1];
                        tImgData.data[localIdx + 2] = data[globalIdx + 2];
                        tImgData.data[localIdx + 3] = data[globalIdx + 3];
                    });
                    
                    tCtx.putImageData(tImgData, 0, 0);
                    
                    // Identificar si este componente son los lentes (Esquina superior específica)
                    let isGlasses = false;
                    const centerX = (comp.minX + comp.maxX) / 2;
                    const centerY = (comp.minY + comp.maxY) / 2;
                    
                    if (type === 'hero') {
                        if (centerX < width * 0.35 && centerY < height * 0.38) isGlasses = true;
                    } else {
                        if (centerX > width * 0.65 && centerY < height * 0.45) isGlasses = true;
                    }
                    
                    return {
                        id: i,
                        src: tCvs.toDataURL(),
                        left: (comp.minX / width * 100),
                        top: (comp.minY / height * 100),
                        width: (compW / width * 100),
                        height: (compH / height * 100),
                        isGlasses
                    };
                });
                
                setLogoData({
                    originalWidth: width,
                    originalHeight: height,
                    parts: extracted
                });
            } catch(e) {
                console.error("Error aislando letras del logo:", e);
            }
        };
    }, [src, type]);

    if (!logoData) {
        return <img id={id} src={src} className={className} alt={alt} />;
    }

    return (
        <div 
            id={id} 
            className={`relative inline-block animated-logo-container group ${className}`} 
            style={{ 
                aspectRatio: `${logoData.originalWidth} / ${logoData.originalHeight}`,
                // Este div base NO captura hovers si tiene pointer-events-none desde CSS, 
                // las letras SÍ lo harán gracias a pointer-events-auto
            }}
        >
            {logoData.parts.map((part, index) => {
                if (part.isGlasses) {
                    return (
                        <img 
                            key={part.id}
                            src={part.src}
                            className="absolute pointer-events-auto logo-glasses-part"
                            style={{
                                left: `${part.left}%`,
                                top: `${part.top}%`,
                                width: `${part.width}%`,
                                height: `${part.height}%`,
                                // Evita que la imagen estirada se pixele
                                objectFit: 'contain'
                            }}
                            alt="Lentes"
                        />
                    );
                }
                
                // Las letras reciben el efecto de ola (text-wave-hover)
                return (
                    <img 
                        key={part.id}
                        src={part.src}
                        className="absolute pointer-events-auto text-wave-hover"
                        style={{
                            left: `${part.left}%`,
                            top: `${part.top}%`,
                            width: `${part.width}%`,
                            height: `${part.height}%`,
                            objectFit: 'contain',
                            // Retraso exacto de la ola
                            transitionDelay: `${index * 0.03}s`,
                            willChange: 'transform, filter'
                        }}
                        alt="Letra"
                    />
                );
            })}
        </div>
    );
}
