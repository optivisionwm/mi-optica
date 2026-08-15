import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default function HeroLogo3D({
  modelPath = `${import.meta.env.BASE_URL}assets/logo-3d/models/optivision-logo.glb`,
  onReady,
}) {
  const containerRef = useRef(null);
  const hoveredRef = useRef(false);
  const pressedRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0, active: false, touch: false });
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let frame = 0;
    let modelSize = null;
    let visible = true;
    let spinStarted = false;
    let spinTime = 0;
    let interactionScale = 1;
    let depthScale = 1;
    let tiltX = 0;
    let tiltY = 0;
    let lightX = 0;
    let lightY = 0;
    let shadowX = 0;
    let shadowY = 18;
    let lastShadow = '';
    let preloaderObserver = null;
    const clock = new THREE.Clock();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.03, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.setAttribute('aria-label', 'Logo 3D de Optivision W&M');
    container.appendChild(renderer.domElement);

    const environmentGenerator = new THREE.PMREMGenerator(renderer);
    const environment = environmentGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    environmentGenerator.dispose();

    const keyLight = new THREE.DirectionalLight('#fff4e7', 4.5);
    keyLight.position.set(-4, 5, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#c7dcff', 2.2);
    fillLight.position.set(5, 0, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#ffffff', 3.4);
    rimLight.position.set(1, 4, -6);
    scene.add(rimLight);

    const pointerLight = new THREE.PointLight('#ffe8c8', 3.4, 18, 1.5);
    pointerLight.position.set(0, 1, 5);
    scene.add(pointerLight);

    const interactionRoot = new THREE.Group();
    const spinRoot = new THREE.Group();
    interactionRoot.add(spinRoot);
    scene.add(interactionRoot);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const aspect = width / height;
      camera.aspect = aspect;

      if (modelSize) {
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
        const padding = width < 600 ? 1.24 : 1.18;
        const heightDistance = (modelSize.y * padding * 0.5) / Math.tan(verticalFov / 2);
        const widthDistance = (modelSize.x * padding * 0.5) / Math.tan(horizontalFov / 2);
        camera.position.z = Math.max(heightDistance, widthDistance) + modelSize.z * 0.75;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    function startLoop() {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render);
    }

    function render() {
      frame = 0;
      if (!visible || document.hidden) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const pointer = pointerRef.current;
      const mobileIntensity = pointer.touch ? 0.52 : 1;
      const targetTiltX = !reduceMotion && pointer.active ? -pointer.y * 0.13 * mobileIntensity : 0;
      const targetTiltY = !reduceMotion && pointer.active ? pointer.x * 0.16 * mobileIntensity : 0;
      const targetScale = !reduceMotion && pressedRef.current
        ? 1.018
        : !reduceMotion && hoveredRef.current ? 1.04 : 1;
      const targetDepth = !reduceMotion && pointer.active ? 1.07 : 1;

      tiltX = THREE.MathUtils.damp(tiltX, targetTiltX, 8, delta);
      tiltY = THREE.MathUtils.damp(tiltY, targetTiltY, 8, delta);
      interactionScale = THREE.MathUtils.damp(interactionScale, targetScale, 9, delta);
      depthScale = THREE.MathUtils.damp(depthScale, targetDepth, 8, delta);
      interactionRoot.rotation.set(tiltX, tiltY, 0);
      interactionRoot.scale.set(interactionScale, interactionScale, interactionScale * depthScale);

      if (!reduceMotion && spinStarted) {
        spinTime += delta;
        spinRoot.rotation.y = Math.sin(spinTime * 0.24) * 0.42;
      }

      lightX = THREE.MathUtils.damp(lightX, pointer.active ? pointer.x * 4 : 0, 7, delta);
      lightY = THREE.MathUtils.damp(lightY, pointer.active ? -pointer.y * 3 : 1, 7, delta);
      pointerLight.position.set(lightX, lightY, 5);
      pointerLight.intensity = THREE.MathUtils.damp(
        pointerLight.intensity,
        pointer.active && !reduceMotion ? 7 : 3.4,
        7,
        delta,
      );

      shadowX = THREE.MathUtils.damp(shadowX, pointer.active ? -pointer.x * 18 : 0, 7, delta);
      shadowY = THREE.MathUtils.damp(shadowY, pointer.active ? 16 + pointer.y * 10 : 18, 7, delta);
      const shadow = `drop-shadow(${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 28px rgba(0, 0, 0, .34))`;
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
    });
    visibilityObserver.observe(container);

    const handleVisibility = () => {
      if (!document.hidden) {
        clock.getDelta();
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    new GLTFLoader().load(
      modelPath,
      (gltf) => {
        if (disposed) return;
        const modelRoot = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(modelRoot);
        const center = bounds.getCenter(new THREE.Vector3());
        modelSize = bounds.getSize(new THREE.Vector3());
        modelRoot.position.sub(center);
        spinRoot.add(modelRoot);

        modelRoot.traverse((object) => {
          if (!object.isMesh) return;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (!material) return;
            material.envMapIntensity = Math.max(material.envMapIntensity ?? 1, 1.15);
            if ('roughness' in material) material.roughness = Math.min(material.roughness, 0.38);
          });
        });

        const startSpin = () => {
          spinStarted = true;
          preloaderObserver?.disconnect();
          preloaderObserver = null;
          startLoop();
        };
        const preloader = document.getElementById('preloader');
        if (!preloader || preloader.classList.contains('hidden')) {
          startSpin();
        } else {
          preloaderObserver = new MutationObserver(() => {
            if (preloader.classList.contains('hidden')) startSpin();
          });
          preloaderObserver.observe(preloader, { attributes: true, attributeFilter: ['class'] });
        }

        resize();
        container.classList.add('is-rendered');
        onReadyRef.current?.();
        startLoop();
      },
      undefined,
      (error) => {
        if (!disposed) console.error('No se pudo cargar el logo 3D:', error);
      },
    );

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      preloaderObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material?.dispose());
      });
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [modelPath]);

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
    hoveredRef.current = false;
    pressedRef.current = false;
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    pointerRef.current.active = false;
    pointerRef.current.touch = false;
  };

  return (
    <div
      ref={containerRef}
      className="hero-logo-canvas"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') hoveredRef.current = true;
        updatePointer(event);
      }}
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
    />
  );
}
