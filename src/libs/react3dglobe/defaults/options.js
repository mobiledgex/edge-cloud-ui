export default {
  camera: {
    far: 1e7,
    near: 50,
    positionX: 0,
    positionY: 0,
    radiusScale: 6.4,
    viewAngle: 25,
  },
  orbitControls: {
    autoRotate: true,
    autoRotateSpeed: 0.00,
    rotateSpeed: 0.05,
    enableDamping: true,
    dampingFactor: 0.1,
    enablePan: false,
    enableZoom: false,
    enableRotate: false,
    zoomSpeed: 1,
    minPolarAngle: Math.PI * 7 / 16,
    maxPolarAngle: Math.PI * 9 / 16,
  },
  globe: {
    isFocused: true,
    widthSegments: 160,
    heightSegments: 80,
    type: 'real',
  },
  space: {
    radius: 6371, // earth 6371
    widthSegments: 80,
    heightSegments: 40,
  },
  renderer: {
    antialias: true,
  },
  light: {
    sceneLightColor: 0x333333,
    sceneLightIntensity: 0.125,
    frontLightColor: 0xffffff,
    frontLightIntensity: 0.6,
    backLightColor: 0xffffff,
    backLightIntensity: 0.1,
  },
};
