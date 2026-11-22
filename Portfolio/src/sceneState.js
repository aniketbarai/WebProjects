// Mutable scroll targets shared with the lazy-loaded WebGL scene. ScrollTrigger
// writes into this object; useFrame reads it without re-rendering React on scroll.
export const sceneState = {
  target: {
    x: 2.45,
    y: 0.5,
    z: -0.5,
    scale: 1,
    rotation: 0,
    morph: 0.18,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 8,
  },
  pointer: { x: 0, y: 0 },
};

// Stops are interpolated at the actual document positions of each section,
// including ScrollTrigger's pin spacer, so the sculpture never jumps at a cut.
export const sceneStops = [
  { id: 'hero', x: 2.45, y: 0.5, z: -0.5, scale: 1, rotation: 0, morph: 0.18, cameraX: 0, cameraY: 0, cameraZ: 8 },
  { id: 'projects', x: -2.15, y: -0.45, z: -1.25, scale: 0.72, rotation: 2.3, morph: 0.55, cameraX: -0.12, cameraY: 0.08, cameraZ: 8.6 },
  { id: 'about', x: 2.35, y: -0.35, z: -0.8, scale: 0.82, rotation: 4.2, morph: 0.92, cameraX: 0.12, cameraY: -0.06, cameraZ: 8.2 },
  { id: 'skills', x: -2.2, y: 0.45, z: -1.3, scale: 0.6, rotation: 6.1, morph: 0.35, cameraX: -0.1, cameraY: 0.06, cameraZ: 8.8 },
  { id: 'experience', x: 2.4, y: 0, z: -1.5, scale: 0.65, rotation: 8.2, morph: 0.7, cameraX: 0.08, cameraY: 0, cameraZ: 8.5 },
  { id: 'education', x: -2.25, y: 0.1, z: -1.8, scale: 0.58, rotation: 9.7, morph: 0.35, cameraX: -0.06, cameraY: 0.04, cameraZ: 8.9 },
  { id: 'contact', x: 1.95, y: 0.1, z: -0.3, scale: 1.1, rotation: 12, morph: 0.68, cameraX: 0, cameraY: 0, cameraZ: 8 },
];
