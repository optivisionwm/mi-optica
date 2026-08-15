import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const GLASSES_TEXTURE = `${import.meta.env.BASE_URL}assets/glasses-qs.png`;

export default function Sunglasses3D() {
  const containerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false, touch: false });
  const pressedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let frame = 0;
    let visible = true;
    let modelSize = null;
    let tiltX = 0;
    let tiltY = 0;
    let scale = 1;
    let lightX = 0;
    let lightY = 1;
    let shadowX = 0;
    let shadowY = 20;
    let lastShadow = '';
    const clock = new THREE.Clock();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const environmentGenerator = new THREE.PMREMGenerator(renderer);
    const environment = environmentGenerator.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = environment;
    environmentGenerator.dispose();

    const keyLight = new THREE.DirectionalLight('#fff3de', 4.2);
    keyLight.position.set(-4, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#d8e3ee', 2.5);
    rimLight.position.set(4, 2, -4);
    scene.add(rimLight);

    const pointerLight = new THREE.PointLight('#ffe0ad', 3.8, 15, 1.4);
    pointerLight.position.set(0, 1, 5);
    scene.add(pointerLight);

    const interactionRoot = new THREE.Group();
    const motionRoot = new THREE.Group();
    interactionRoot.add(motionRoot);
    scene.add(interactionRoot);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const aspect = width / height;
      camera.aspect = aspect;

      if (modelSize) {
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
        const padding = width < 600 ? 1.16 : 1.1;
        const heightDistance = (modelSize.y * padding * 0.5) / Math.tan(verticalFov / 2);
        const widthDistance = (modelSize.x * padding * 0.5) / Math.tan(horizontalFov / 2);
        camera.position.z = Math.max(heightDistance, widthDistance) + modelSize.z;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      startLoop();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    function startLoop() {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render);
    }

    function render() {
      frame = 0;
      if (!visible || document.hidden) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const pointer = pointerRef.current;
      const pointerIntensity = pointer.touch ? 0.52 : 1;
      const targetTiltX = !reduceMotion && pointer.active ? -pointer.y * 0.14 * pointerIntensity : 0;
      const targetTiltY = !reduceMotion && pointer.active ? pointer.x * 0.2 * pointerIntensity : 0;
      const targetScale = !reduceMotion
        ? (pressedRef.current ? 1.015 : pointer.active ? 1.035 : 1)
        : 1;

      tiltX = THREE.MathUtils.damp(tiltX, targetTiltX, 8, delta);
      tiltY = THREE.MathUtils.damp(tiltY, targetTiltY, 8, delta);
      scale = THREE.MathUtils.damp(scale, targetScale, 8, delta);
      interactionRoot.rotation.set(tiltX, tiltY, 0);
      interactionRoot.scale.setScalar(scale);

      if (!reduceMotion) {
        motionRoot.rotation.y = Math.sin(elapsed * 0.58) * 0.31;
        motionRoot.rotation.x = Math.sin(elapsed * 0.36) * 0.025;
        motionRoot.position.y = Math.sin(elapsed * 0.72) * 0.035;
      }

      lightX = THREE.MathUtils.damp(lightX, pointer.active ? pointer.x * 4 : 0, 7, delta);
      lightY = THREE.MathUtils.damp(lightY, pointer.active ? -pointer.y * 2.8 : 1, 7, delta);
      pointerLight.position.set(lightX, lightY, 5);
      pointerLight.intensity = THREE.MathUtils.damp(
        pointerLight.intensity,
        pointer.active && !reduceMotion ? 7.2 : 3.8,
        7,
        delta,
      );

      shadowX = THREE.MathUtils.damp(
        shadowX,
        pointer.active && !reduceMotion ? -pointer.x * 16 : 0,
        7,
        delta,
      );
      shadowY = THREE.MathUtils.damp(
        shadowY,
        pointer.active && !reduceMotion ? 17 + pointer.y * 9 : 20,
        7,
        delta,
      );
      const shadow = `drop-shadow(${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 25px rgba(38, 31, 25, .28))`;
      if (shadow !== lastShadow) {
        renderer.domElement.style.filter = shadow;
        lastShadow = shadow;
      }

      renderer.render(scene, camera);
      if (!reduceMotion) frame = requestAnimationFrame(render);
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        clock.getDelta();
        startLoop();
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: '120px' });
    visibilityObserver.observe(container);

    const handleVisibility = () => {
      if (!document.hidden) {
        clock.getDelta();
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    new THREE.TextureLoader().load(
      GLASSES_TEXTURE,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

        const width = 4.9;
        const ratio = texture.image.width / texture.image.height;
        const height = width / ratio;
        const depth = 0.22;
        const geometry = new THREE.PlaneGeometry(width, height, 1, 1);

        for (let layer = 11; layer >= 1; layer -= 1) {
          const depthMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            color: layer > 7 ? '#433b36' : '#725b4c',
            transparent: true,
            opacity: 0.32,
            alphaTest: 0.035,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false,
          });
          const depthLayer = new THREE.Mesh(geometry, depthMaterial);
          depthLayer.position.z = -(depth * layer) / 11;
          depthLayer.renderOrder = 11 - layer;
          motionRoot.add(depthLayer);
        }

        const frontMaterial = new THREE.MeshPhysicalMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.035,
          roughness: 0.34,
          metalness: 0.2,
          clearcoat: 0.3,
          clearcoatRoughness: 0.22,
          envMapIntensity: 1.2,
          side: THREE.DoubleSide,
        });
        const front = new THREE.Mesh(geometry, frontMaterial);
        front.position.z = 0.012;
        front.renderOrder = 20;
        motionRoot.add(front);

        modelSize = new THREE.Vector3(width, height, depth);
        resize();
        container.classList.add('is-rendered');
        startLoop();
      },
      undefined,
      (error) => {
        if (!disposed) console.error('No se pudieron preparar los lentes 3D:', error);
      },
    );

    resize();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          material?.map?.dispose();
          material?.dispose();
        });
      });
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const updatePointer = (event) => {
    if (event.pointerType !== 'mouse' && !pressedRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const pointer = pointerRef.current;
    pointer.x = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    pointer.y = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    pointer.active = true;
    pointer.touch = event.pointerType !== 'mouse';
  };

  const resetPointer = () => {
    pressedRef.current = false;
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    pointerRef.current.active = false;
    pointerRef.current.touch = false;
  };

  return (
    <div
      ref={containerRef}
      className="qs-glasses-3d"
      role="img"
      aria-label="Lentes de sol Optivisión en vista tridimensional"
      onPointerEnter={updatePointer}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      onPointerDown={(event) => {
        pressedRef.current = true;
        updatePointer(event);
      }}
      onPointerUp={(event) => {
        pressedRef.current = false;
        if (event.pointerType !== 'mouse') resetPointer();
      }}
      onPointerCancel={resetPointer}
    >
      <img src={GLASSES_TEXTURE} alt="" aria-hidden="true" className="qs-glasses-fallback" />
    </div>
  );
}
