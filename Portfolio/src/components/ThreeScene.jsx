import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '../sceneState';

// An open-ended, twisted band instead of the old orb: empty space stays visible
// between the folds, so the typography remains the star of the composition.
function makeRibbon() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.88, -1.35, 0.2),
    new THREE.Vector3(-1.68, -0.25, 0.35),
    new THREE.Vector3(-1.12, 0.92, -0.3),
    new THREE.Vector3(-0.2, 1.54, -0.42),
    new THREE.Vector3(0.9, 1.52, 0.07),
    new THREE.Vector3(1.76, 0.72, 0.3),
    new THREE.Vector3(1.54, -0.22, -0.14),
    new THREE.Vector3(0.72, -0.52, -0.42),
    new THREE.Vector3(-0.25, -0.36, 0.5),
    new THREE.Vector3(-0.35, -1.2, 0.4),
    new THREE.Vector3(0.83, -1.42, -0.26),
  ], false, 'centripetal');

  const segments = 128;
  const columns = 5;
  const vertices = (segments + 1) * (columns + 1);
  const positions = new Float32Array(vertices * 3);
  const base = new Float32Array(vertices * 3);
  const phases = new Float32Array(vertices);
  const indices = [];
  const axis = new THREE.Vector3(0, 0, 1);
  const side = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const center = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    side.crossVectors(tangent, axis).normalize();
    // Two broad folds, an open return, and softly tapered cut-paper ends.
    side.applyAxisAngle(tangent, t * Math.PI * 2.1 - 0.34);
    const taper = Math.min(1, 0.35 + t * 9, 0.35 + (1 - t) * 9);
    const width = (0.64 + 0.17 * Math.sin(t * Math.PI * 3.2)) * taper;
    for (let j = 0; j <= columns; j++) {
      const v = j / columns * 2 - 1;
      const n = i * (columns + 1) + j;
      const o = n * 3;
      base[o] = center.x + side.x * v * width;
      base[o + 1] = center.y + side.y * v * width;
      base[o + 2] = center.z + side.z * v * width;
      positions.set(base.subarray(o, o + 3), o);
      phases[n] = t;
      if (i < segments && j < columns) {
        const next = n + columns + 1;
        indices.push(n, next, n + 1, n + 1, next, next + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return { geometry, base, phases };
}

function Sculpture() {
  const group = useRef();
  const mesh = useRef();
  const morph = useRef(0);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const { geometry, base, phases } = useMemo(makeRibbon, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ camera, clock }, delta) => {
    if (!group.current || !mesh.current) return;
    const dt = Math.min(delta, 0.05);
    const target = sceneState.target;
    const pointer = sceneState.pointer;
    const elapsed = clock.elapsedTime;

    targetPosition.set(target.x + pointer.x * 0.16, target.y + pointer.y * 0.1, target.z);
    group.current.position.lerp(targetPosition, 1 - Math.exp(-2.8 * dt));
    const scale = THREE.MathUtils.damp(group.current.scale.x, target.scale, 2.8, dt);
    group.current.scale.setScalar(scale);
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, 0.08 + target.rotation * 0.09 - pointer.y * 0.12, 2, dt);
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, target.rotation * 0.72 + pointer.x * 0.2, 2, dt);
    mesh.current.rotation.z = THREE.MathUtils.damp(mesh.current.rotation.z, target.rotation * 0.23, 2, dt);
    morph.current = THREE.MathUtils.damp(morph.current, target.morph, 2.2, dt);

    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const t = phases[i];
      const o = i * 3;
      const fold = Math.sin(t * Math.PI * 4.1 + elapsed * 0.32) * Math.sin(t * Math.PI);
      positions.setXYZ(i,
        base[o] + fold * morph.current * 0.12,
        base[o + 1] + fold * morph.current * 0.06,
        base[o + 2] + fold * (0.04 + morph.current * 0.22),
      );
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.cameraX + pointer.x * 0.07, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.cameraY + pointer.y * 0.05, 2, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.cameraZ, 2, dt);
    camera.lookAt(0, 0, 0);
  });

  return (
    <Float speed={0.5} rotationIntensity={0.045} floatIntensity={0.1} floatingRange={[-0.06, 0.06]}>
      <group ref={group} position={[2.45, 0.5, -0.5]}>
        <mesh ref={mesh} geometry={geometry}>
          <meshPhysicalMaterial color="#ff4d00" side={THREE.DoubleSide} roughness={0.32} metalness={0.24} clearcoat={0.55} clearcoatRoughness={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ThreeScene({ onReady, paused }) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    // The canvas is fixed, but the page/scene can leave the viewport at the
    // footer. Stop frames there and whenever the tab is hidden.
    const main = document.getElementById('site-main');
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (main) observer.observe(main);
    document.addEventListener('visibilitychange', update);
    const pointer = event => {
      sceneState.pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      sceneState.pointer.y = (0.5 - event.clientY / window.innerHeight) * 2;
    };
    const resetPointer = () => { sceneState.pointer.x = 0; sceneState.pointer.y = 0; };
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('blur', resetPointer);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('blur', resetPointer);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 40, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      frameloop={active && !paused ? 'always' : 'never'}
      onCreated={onReady}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[-4, 6, 5]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[4, -3, 3]} intensity={1.3} color="#ff9973" />
      <Sculpture />
    </Canvas>
  );
}
