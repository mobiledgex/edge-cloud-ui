export default {
  camera: {
    far: 20000,
    near: 1,
    positionX: 0,
    positionY: 1000,
    radiusScale: 3,
    viewAngle: 45,
  },
  orbitControls: {
    autoRotate: true,
    autoRotateSpeed: 0.04,
    rotateSpeed: 0.04,
    enableDamping: true,
    dampingFactor: 0.1,
    enablePan: true,
    enableZoom: false,
    enableRotate: true,
    zoomSpeed: 1,
    minPolarAngle: Math.PI * 7 / 16,
    maxPolarAngle: Math.PI * 9 / 16,
  },
  globe: {
    isFocused: true,
    widthSegments: 120,
    heightSegments: 120,
    type: 'real',
  },
  space: {
    radius: 18000, // earth 6371
    widthSegments: 80,
    heightSegments: 80,
  },
  renderer: {
    antialias: true,
  },
  light: {
    sceneLightColor: 0xffffff,
    sceneLightIntensity: 0.6,
    frontLightColor: 0xffffff,
    frontLightIntensity: 3.6,
    backLightColor: 0xf5f5dc,
    backLightIntensity: 60,
  },
};
