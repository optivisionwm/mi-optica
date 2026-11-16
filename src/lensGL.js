import * as THREE from 'three';

// Cristal del probador en WebGL.
// Dentro del aro: "Quiénes Somos" visto a través de un vidrio (lupa + aberración cromática).
// Fuera del aro: la foto se curva hacia el borde, como la luz alrededor de un agujero negro.
// Lejos del aro el canvas es transparente y se ve la foto del DOM, idéntica.

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uPhoto;
  uniform vec4 uPhotoRect;   // x, y, ancho, alto de la foto dibujada (px CSS)
  uniform sampler2D uQs;
  uniform vec2 uQsSize;      // tamaño de la captura (px CSS)
  uniform float uHasQs;
  uniform vec2 uRes;         // tamaño del canvas (px de dispositivo)
  uniform float uDpr;
  uniform vec2 uCenter;      // centro del lente (px CSS)
  uniform float uRadius;     // radio actual del lente (px CSS)
  uniform float uReveal;     // 0 = foto, 1 = siguiente sección dentro del lente
  uniform float uLensK;      // fuerza de la lupa (0 = plano)
  uniform float uWarp;       // curvatura de la foto alrededor del aro
  uniform float uSoft;       // leve suavizado (nivel de mipmap)
  uniform float uRim;        // brillo y sombra del borde del vidrio
  uniform float uPull;       // succión: 0 = foto quieta, 1 = toda la portada tragada por el lente

  vec4 photoAt(vec2 p) {
    vec2 uv = (p - uPhotoRect.xy) / uPhotoRect.zw;
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
    return vec4(texture2D(uPhoto, vec2(uv.x, 1.0 - uv.y)).rgb, 1.0);
  }

  // Foto con borde difuminado mientras se succiona; fuera de ella, bruma que se oscurece.
  // En reposo (uPull = 0) es idéntica a la foto del HTML.
  vec4 photoOrSpace(vec2 p) {
    vec2 uv = (p - uPhotoRect.xy) / uPhotoRect.zw;
    vec2 cuv = clamp(uv, vec2(0.0), vec2(1.0));
    bool inBounds = uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0;
    vec3 photo = texture2D(uPhoto, vec2(cuv.x, 1.0 - cuv.y)).rgb;
    vec3 haze = textureLod(uPhoto, vec2(cuv.x, 1.0 - cuv.y), 7.0).rgb;
    vec3 space = haze * mix(0.9, 0.22, smoothstep(0.1, 0.8, uPull));
    float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float keep = inBounds ? smoothstep(0.0, 0.0001 + 0.12 * uPull, edgeDist) : 0.0;
    vec3 col = mix(space, photo, keep);
    float alpha = inBounds ? 1.0 : smoothstep(0.0, 0.12, uPull);
    return vec4(col, alpha);
  }

  vec3 qsAt(vec2 p, float lod) {
    vec2 uv = clamp(p / uQsSize, vec2(0.0), vec2(1.0));
    return textureLod(uQs, vec2(uv.x, 1.0 - uv.y), lod).rgb;
  }

  void main() {
    vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
    vec2 d = p - uCenter;
    float dist = length(d);
    vec2 dir = d / max(dist, 0.0001);
    float r = max(uRadius, 1.0);
    float x = dist / r;

    // --- Fuera: la portada se curva y es succionada en espiral hacia el aro ---
    float u = max(dist - r, 0.0);
    float squeeze = 1.0 / max(1.0 - 0.94 * uPull, 0.06);
    float swirl = uPull * 2.6 * exp(-u / (r * 1.6));
    float cs = cos(swirl);
    float sn = sin(swirl);
    vec2 sdir = vec2(cs * dir.x - sn * dir.y, sn * dir.x + cs * dir.y);
    float reach = r * 2.6;
    float fall = 1.0 - smoothstep(r, reach, dist);
    float lensDisp = uWarp * r * fall * fall;
    vec4 outside = photoOrSpace(uCenter + sdir * (r + u * squeeze + lensDisp));
    outside.rgb *= 1.0 - 0.5 * uWarp * pow(fall, 3.0) - 0.35 * uPull * exp(-u / (r * 0.9));
    // Halo cálido en el borde mientras traga
    outside.rgb += vec3(1.0, 0.86, 0.62) * 0.16 * uPull * exp(-u / (r * 0.18));
    if (uPull < 0.001 && uWarp < 0.001 && dist > reach) outside = vec4(0.0);

    // --- Dentro: la siguiente sección a través del vidrio ---
    float bend = uLensK * (1.0 - x * x);
    float lod = uSoft * (0.35 + 0.65 * x);
    vec3 glass = vec3(
      qsAt(uCenter + d * (1.0 - bend * 0.94), lod).r,
      qsAt(uCenter + d * (1.0 - bend), lod).g,
      qsAt(uCenter + d * (1.0 - bend * 1.06), lod).b
    );
    vec3 behind = photoAt(p).rgb;
    vec3 inside = mix(behind, glass, uReveal * uHasQs);
    float rim = smoothstep(0.74, 1.0, x);
    inside *= 1.0 - 0.42 * rim * rim * uRim;
    float spec = pow(max(0.0, dot(dir, normalize(vec2(-0.55, -0.83)))), 5.0) * smoothstep(0.84, 0.985, x);
    inside += spec * 0.38 * uRim * uReveal;

    // Borde suave de 1,5 px entre dentro y fuera
    float edge = smoothstep(r - 1.5, r + 0.5, dist);
    vec4 col = mix(vec4(inside, 1.0), outside, edge);
    gl_FragColor = vec4(col.rgb * col.a, col.a);
  }
`;

export function createLensGL(canvas, photoImage) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);

  const makeTexture = (source) => {
    const texture = new THREE.Texture(source);
    texture.colorSpace = THREE.NoColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  };

  // Copia fija de la foto: si el navegador cambia la imagen del srcset, la textura no cambia de tamaño.
  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = photoImage.naturalWidth || 1280;
  photoCanvas.height = photoImage.naturalHeight || 853;
  photoCanvas.getContext('2d').drawImage(photoImage, 0, 0, photoCanvas.width, photoCanvas.height);
  const photoTexture = makeTexture(photoCanvas);
  const blank = new THREE.DataTexture(new Uint8Array([250, 248, 244, 255]), 1, 1);
  blank.needsUpdate = true;

  const uniforms = {
    uPhoto: { value: photoTexture },
    uPhotoRect: { value: new THREE.Vector4(0, 0, 1, 1) },
    uQs: { value: blank },
    uQsSize: { value: new THREE.Vector2(1, 1) },
    uHasQs: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: dpr },
    uCenter: { value: new THREE.Vector2(0, 0) },
    uRadius: { value: 1 },
    uReveal: { value: 0 },
    uLensK: { value: 0 },
    uWarp: { value: 0 },
    uSoft: { value: 0 },
    uRim: { value: 0 },
    uPull: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  let qsTexture = null;

  return {
    resize(width, height) {
      renderer.setSize(width, height, false);
      uniforms.uRes.value.set(Math.round(width * dpr), Math.round(height * dpr));
    },
    setQs(source, cssWidth, cssHeight) {
      qsTexture?.dispose();
      qsTexture = makeTexture(source);
      uniforms.uQs.value = qsTexture;
      uniforms.uQsSize.value.set(cssWidth, cssHeight);
      uniforms.uHasQs.value = 1;
    },
    render(state) {
      uniforms.uPhotoRect.value.set(state.photoRect.x, state.photoRect.y, state.photoRect.w, state.photoRect.h);
      uniforms.uCenter.value.set(state.cx, state.cy);
      uniforms.uRadius.value = state.radius;
      uniforms.uReveal.value = state.reveal;
      uniforms.uLensK.value = state.lensK;
      uniforms.uWarp.value = state.warp;
      uniforms.uSoft.value = state.soft;
      uniforms.uRim.value = state.rim;
      uniforms.uPull.value = state.pull ?? 0;
      renderer.render(scene, camera);
    },
    dispose() {
      photoTexture.dispose();
      qsTexture?.dispose();
      blank.dispose();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    },
  };
}
