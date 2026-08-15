import { StrictMode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, Pause, Play, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './preview.css';


const ASSETS = {
  assembled: {
    label: 'Completo',
    glb: `${import.meta.env.BASE_URL}assets/logo-3d/models/optivision-logo.glb`,
    vector: null,
  },
  glasses: {
    label: 'Gafas',
    glb: `${import.meta.env.BASE_URL}assets/logo-3d/models/glasses.glb`,
    vector: `${import.meta.env.BASE_URL}assets/logo-3d/vector/glasses.svg`,
  },
  optivision: {
    label: 'Optivision',
    glb: `${import.meta.env.BASE_URL}assets/logo-3d/models/optivision.glb`,
    vector: `${import.meta.env.BASE_URL}assets/logo-3d/vector/optivision.svg`,
  },
  wm: {
    label: 'W&M',
    glb: `${import.meta.env.BASE_URL}assets/logo-3d/models/wm.glb`,
    vector: `${import.meta.env.BASE_URL}assets/logo-3d/vector/wm.svg`,
  },
};


export const Logo3DViewer = forwardRef(function Logo3DViewer(
  { asset, rotating, onReady, onError },
  ref,
) {
  const containerRef = useRef(null);
  const runtimeRef = useRef(null);
  const rotatingRef = useRef(rotating);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    rotatingRef.current = rotating;
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
  }, [onError, onReady, rotating]);

  useImperativeHandle(ref, () => ({
    reset() {
      const runtime = runtimeRef.current;
      if (!runtime) return;
      runtime.controls.reset();
      runtime.camera.position.set(0, 0.05, runtime.cameraDistance());
      runtime.controls.target.set(0, 0, 0);
      runtime.controls.update();
      runtime.action?.reset().play();
      runtime.mixer?.setTime(0);
    },
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let frame = 0;
    let mixer = null;
    let action = null;
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0d0d');

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label', `Modelo 3D: ${asset.label}`);
    container.appendChild(renderer.domElement);

    const environmentGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = environmentGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    environmentGenerator.dispose();

    const keyLight = new THREE.DirectionalLight('#fff1dc', 4.2);
    keyLight.position.set(-4, 6, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#b9d8ff', 2.1);
    fillLight.position.set(5, 1, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#ffffff', 3.2);
    rimLight.position.set(1, 4, -6);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5.5;
    controls.maxDistance = 18;
    controls.target.set(0, 0, 0);

    const cameraDistance = () => (camera.aspect < 0.75 ? 15.5 : camera.aspect < 1.1 ? 11 : 8.5);
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.position.z = cameraDistance();
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    controls.saveState();

    runtimeRef.current = { camera, controls, cameraDistance, action: null, mixer: null };

    new GLTFLoader().load(
      asset.glb,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        model.name = 'OptivisionLogoPreview';
        scene.add(model);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          action = mixer.clipAction(gltf.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          runtimeRef.current.action = action;
          runtimeRef.current.mixer = mixer;
        }
        onReadyRef.current();
      },
      undefined,
      (error) => {
        if (!disposed) onErrorRef.current(error);
      },
    );

    const render = () => {
      frame = requestAnimationFrame(render);
      const delta = Math.min(clock.getDelta(), 0.05);
      if (rotatingRef.current) mixer?.update(delta);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material?.dispose());
      });
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      runtimeRef.current = null;
    };
  }, [asset]);

  return <div className="viewer-canvas" ref={containerRef} />;
});


export function Logo3DPreview() {
  const [selection, setSelection] = useState('assembled');
  const [rotating, setRotating] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [status, setStatus] = useState('loading');
  const viewerRef = useRef(null);
  const asset = ASSETS[selection];

  const selectAsset = (name) => {
    setStatus('loading');
    setSelection(name);
  };

  return (
    <main className="preview-shell">
      <Logo3DViewer
        key={selection}
        ref={viewerRef}
        asset={asset}
        rotating={rotating}
        onReady={() => setStatus('ready')}
        onError={() => setStatus('error')}
      />

      <header className="preview-toolbar">
        <div className="preview-title">
          <strong>OPTIVISION W&M</strong>
          <span>Modelo 3D</span>
        </div>

        <div className="part-selector" aria-label="Pieza del logo">
          {Object.entries(ASSETS).map(([name, item]) => (
            <button
              key={name}
              type="button"
              className={selection === name ? 'is-active' : ''}
              aria-pressed={selection === name}
              onClick={() => selectAsset(name)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="preview-actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => setRotating((value) => !value)}
            aria-label={rotating ? 'Pausar giro' : 'Reanudar giro'}
            title={rotating ? 'Pausar giro' : 'Reanudar giro'}
          >
            {rotating ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => viewerRef.current?.reset()}
            aria-label="Restablecer vista"
            title="Restablecer vista"
          >
            <RotateCcw size={18} />
          </button>
          <a
            className="icon-button"
            href={asset.glb}
            download
            aria-label="Descargar GLB"
            title="Descargar GLB"
          >
            <Download size={18} />
          </a>
        </div>
      </header>

      <footer className="preview-status" aria-live="polite">
        <span className={`status-dot status-${status}`} />
        <span>{status === 'error' ? 'No se pudo cargar' : asset.glb.split('/').at(-1)}</span>
        {asset.vector && (
          <a href={asset.vector} download>
            SVG
          </a>
        )}
      </footer>
    </main>
  );
}


createRoot(document.getElementById('logo-3d-root')).render(
  <StrictMode>
    <Logo3DPreview />
  </StrictMode>,
);
