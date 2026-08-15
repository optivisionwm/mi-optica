import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DOMParser as XmlDomParser } from '@xmldom/xmldom';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';


globalThis.DOMParser = class DOMParser {
  parseFromString(source, mimeType) {
    const document = new XmlDomParser().parseFromString(source, mimeType);
    document.querySelectorAll = () => [];
    return document;
  }
};
globalThis.FileReader = class FileReader {
  result = null;
  onloadend = null;
  onerror = null;

  async readAsArrayBuffer(blob) {
    try {
      this.result = await blob.arrayBuffer();
      this.onloadend?.();
    } catch (error) {
      this.onerror?.(error);
    }
  }

  async readAsDataURL(blob) {
    try {
      const buffer = Buffer.from(await blob.arrayBuffer());
      this.result = `data:${blob.type};base64,${buffer.toString('base64')}`;
      this.onloadend?.();
    } catch (error) {
      this.onerror?.(error);
    }
  }
};


const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const assetRoot = path.join(repositoryRoot, 'public', 'assets', 'logo-3d');
const modelDirectory = path.join(assetRoot, 'models');
const manifestPath = path.join(assetRoot, 'manifest.json');
const yAxis = new THREE.Vector3(0, 1, 0);

const extrusionByPart = {
  glasses: { depth: 38, bevelSize: 2.4, bevelThickness: 3.4, z: 28 },
  optivision: { depth: 32, bevelSize: 2.1, bevelThickness: 3.0, z: 0 },
  wm: { depth: 36, bevelSize: 2.3, bevelThickness: 3.2, z: -6 },
};


function createMaterialPair(colorValue, name) {
  const color = new THREE.Color(colorValue);
  const sideColor = color.clone().multiplyScalar(0.56);
  const isGlasses = name === 'glasses';

  return [
    new THREE.MeshStandardMaterial({
      name: `${name}_face`,
      color,
      metalness: isGlasses ? 0.42 : 0.62,
      roughness: isGlasses ? 0.2 : 0.24,
    }),
    new THREE.MeshStandardMaterial({
      name: `${name}_side`,
      color: sideColor,
      metalness: 0.7,
      roughness: 0.31,
    }),
  ];
}


async function createPart(part) {
  const svg = await fs.readFile(path.join(assetRoot, part.vector), 'utf8');
  const parsed = new SVGLoader().parse(svg);
  const extrusion = extrusionByPart[part.name];
  const materials = createMaterialPair(part.color, part.name);
  const group = new THREE.Group();

  group.name = `logo_${part.name}`;
  group.userData.logoPart = part.name;

  for (const svgPath of parsed.paths) {
    const shapes = svgPath.toShapes();
    for (const shape of shapes) {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: extrusion.depth,
        steps: 1,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: extrusion.bevelSize,
        bevelThickness: extrusion.bevelThickness,
        curveSegments: 10,
      });
      geometry.computeVertexNormals();

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.name = `${part.name}_shape_${group.children.length + 1}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }

  group.scale.y = -1;
  group.position.set(part.sourceBox.x, -part.sourceBox.y, extrusion.z);
  return group;
}


function normalizeModel(model, targetSize = 4) {
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = targetSize / Math.max(size.x, size.y, size.z);

  const normalized = new THREE.Group();
  normalized.name = 'OptivisionLogo';
  model.position.sub(center);
  normalized.scale.setScalar(scale);
  normalized.add(model);
  normalized.updateMatrixWorld(true);
  return normalized;
}


function createSpinAnimation(rootName) {
  const quaternions = [0, Math.PI, Math.PI * 2].map((angle) =>
    new THREE.Quaternion().setFromAxisAngle(yAxis, angle),
  );
  const values = quaternions.flatMap((quaternion) => quaternion.toArray());
  const track = new THREE.QuaternionKeyframeTrack(
    `${rootName}.quaternion`,
    [0, 6, 12],
    values,
    THREE.InterpolateLinear,
  );
  return new THREE.AnimationClip('logo-spin', 12, [track]);
}


async function exportGlb(model, outputPath) {
  const animation = createSpinAnimation(model.name);
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(model, {
    animations: [animation],
    binary: true,
    onlyVisible: true,
    trs: true,
  });
  await fs.writeFile(outputPath, Buffer.from(result));
}


async function main() {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  await fs.mkdir(modelDirectory, { recursive: true });

  const individualModels = {};
  for (const part of manifest.parts) {
    const standalone = normalizeModel(await createPart(part));
    const filename = `${part.name}.glb`;
    await exportGlb(standalone, path.join(modelDirectory, filename));
    individualModels[part.name] = `models/${filename}`;
  }

  const assembly = new THREE.Group();
  assembly.name = 'logo_assembly';
  for (const part of manifest.parts) {
    assembly.add(await createPart(part));
  }

  const assembledModel = normalizeModel(assembly);
  const assembledFilename = 'optivision-logo.glb';
  await exportGlb(assembledModel, path.join(modelDirectory, assembledFilename));

  manifest.models = {
    assembled: `models/${assembledFilename}`,
    parts: individualModels,
    animation: { name: 'logo-spin', durationSeconds: 12, rotationDegrees: 360 },
  };
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'ascii');
}


await main();
