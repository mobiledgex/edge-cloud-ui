import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import * as TWEEN from 'es6-tween';

import {loadTexture} from './loaders';
import {latLongToVector} from './projections';

import Satllite from '../satellite/Satellite';

class Globe {
  constructor(
    width,
    height,
    options,
    textures,
    disableUnfocus,
    onMarkerClick,
    onMarkerMouseover,
    onMarkerMouseout,
  ) {
    this.options = options;
    // Bind class variables this.options = options;
    this.textures = textures;
    this.aspect = width / height;
    this.radius = Math.min(width, height);
    this.width = width;
    this.height = height;
    this.onMarkerClick = onMarkerClick;
    this.onMarkerMouseover = onMarkerMouseover;
    this.onMarkerMouseout = onMarkerMouseout;
    this.markerMap = {};
    this.isFocused = false;
    this.mouseoverObj = null;
    this.tweenMap = {};
    this.preFocus = {x: 0, y: 0, z: 0};
    this.disableUnfocus = disableUnfocus || false;
    this.setupScene();
  }

  setupScene() {
    // build elements
    this.renderer = this._createRenderer();
    this.scene = this._createScene();
    this.camera = this._createCamera();
    this._createLight();
    this.controls = this._createOrbitControls();
    this.space = this._createSpace();
    this.globe = this._createGlobe();
    this.cloud = this._createCloud();
    this.markers = this._createMarkers();
    this.logos = this._createLogos(this.scene);
    this.raycaster = this._createRaycaster();
    this.mouse = this._createMouse();

    // Add to scenes
    this.scene.add(this.camera);
    this.scene.add(this.space);
    this.scene.add(this.globe);
    this.scene.add(this.cloud);
  }

  updateSize(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  setMarkers = markers => {
    this.markers.children = []; // clear before adding
    this.markerMap = {};
    markers.forEach(marker => {
      if (this.options.globe.type === 'low-poly') {
        marker.long = (marker.long + 180) % 180;
      }
      const color = marker.color || 0xffffff;
      let position = latLongToVector(marker.lat, marker.long, this.radius, 2);
      let mesh = null;
      switch (marker.type) {
        case 'bar':
          let size = marker.size || 100;
          let material = new THREE.MeshLambertMaterial({
            color,
            opacity: 0.9,
            transparent: true,
            wireframe: true,
          });
          mesh = new THREE.Mesh(
            new THREE.CubeGeometry(7, 7, size, 1, 1, 1, material),
          );
          this._blink(mesh, {scale: 0.1}, {scale: 1}, false);
          break;
        case 'point':
          size = marker.size || 5;
          position = latLongToVector(
            marker.lat,
            marker.long,
            this.radius,
            size,
          );
          material = new THREE.MeshBasicMaterial({color});
          mesh = new THREE.Mesh(
            new THREE.SphereGeometry(size, 10, 10),
            material,
          );
          this._blink(mesh, {scale: 0.5}, {scale: 1}, true, {scale: 2}, true);
          break;
        default:
          throw new Error('Not supported marker type.');
      }
      mesh.material.color.setHex(color);
      mesh.position.set(position.x, position.y, position.z);
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      this.markerMap[mesh.uuid] = marker;
      this.markers.add(mesh);
    });
    // this.scene.add(this.markers);
  };

  _blink(markerMesh, from, to, recursive, initial, isInitialBlink) {
    const self = this;
    const tweenFrom = isInitialBlink ? initial : from;
    const _from = {...from};
    const _to = {...to};
    const duration = Math.floor(Math.random() * 1000) + 500;
    new TWEEN.Tween(tweenFrom)
      .to(to, duration)
      .easing(TWEEN.Easing.Linear.None)
      .on('update', function() {
        markerMesh.scale.x = this.object.scale;
        markerMesh.scale.y = this.object.scale;
        markerMesh.scale.z = this.object.scale;
      })
      .on('complete', function() {
        if (recursive && markerMesh.uuid in self.markerMap) {
          self._blink(markerMesh, _to, _from, recursive, initial, false);
        }
      })
      .start();
  }

  getRendererDomElement = () => {
    return this.renderer.domElement;
  };

  setDisableUnfocus = disableUnfocus => {
    this.disableUnfocus = disableUnfocus;
    if (!this.disableUnfocus && this.isFocused) {
      this.unfocus();
    }
  };

  onClick = () => {
    //event.preventDefault();
    const {radiusScale} = this.options.camera;
    const obj = this._getIntersectedObject();
    if (obj) {
      if (!this.isFocused) {
        this.preFocus = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        };
      }
      const to = {
        x: obj.position.x * (radiusScale - 1),
        y: obj.position.y * (radiusScale - 1),
        z: obj.position.z * (radiusScale - 1),
      };
      this.focus(to);
      const marker = this.markerMap[obj.uuid];
      //this.onMarkerClick && this.onMarkerClick(event, marker);
    } else {
      // we will use globe.isFocused to override internal focus state
      if (!this.disableUnfocus && this.isFocused) {
        this.unfocus();
      }
    }
  };

  onMousemove = () => {
    //event.preventDefault();
    const self = this;
    const obj = this._getIntersectedObject();
    if (obj) {
      // do nothing when the mouse hasn't moved out of the current object
      if (self.mouseoverObj === obj) {
        return;
      }
      const marker = this.markerMap[obj.uuid];
      //this.onMarkerMouseover && this.onMarkerMouseover(event, marker);
      // when mouse moving from one object direct to another
      // we should reset the previous mouseover object
      if (self.mouseoverObj) {
        self.tweenMap[self.mouseoverObj.uuid].stop();
        self.mouseoverObj.scale.x = 1;
        self.mouseoverObj.scale.y = 1;
        self.mouseoverObj.scale.z = 1;
      }

      self.mouseoverObj = obj;
      const from = {scale: 1};
      const to = {scale: 2};
      self.tweenMap[obj.uuid] = new TWEEN.Tween(from)
        .to(to, 300)
        .easing(TWEEN.Easing.Linear.None)
        .on('update', function() {
          if (self.mouseoverObj == obj) {
            obj.scale.x = this.object.scale;
            obj.scale.y = this.object.scale;
            obj.scale.z = this.object.scale;
          } else {
            obj.scale.x = 1;
            obj.scale.y = 1;
            obj.scale.z = 1;
          }
        })
        .start();
    } else {
      if (self.mouseoverObj) {
        //this.onMarkerMouseout && this.onMarkerMouseout(event);
        self.mouseoverObj.scale.x = 1;
        self.mouseoverObj.scale.y = 1;
        self.mouseoverObj.scale.z = 1;
        self.mouseoverObj = null;
      }
    }
  };

  focus(to) {
    const self = this;
    self.isFocused = true;
    self.controls.autoRotate = false;
    self.controls.enableRotate = false;
    self.controls.minPolarAngle = Math.PI * 3 / 16;
    self.controls.maxPolarAngle = Math.PI * 13 / 16;
    const from = {
      x: self.camera.position.x,
      y: self.camera.position.y,
      z: self.camera.position.z,
    };
    new TWEEN.Tween(from)
      .to(to, 600)
      .easing(TWEEN.Easing.Linear.None)
      .on('update', function() {
        self.camera.position.set(this.object.x, this.object.y, this.object.z);
        self.camera.lookAt(new THREE.Vector3(0, 0, 0));
      })
      .on('complete', function() {
        self.camera.lookAt(new THREE.Vector3(0, 0, 0));
      })
      .start();
  }

  unfocus() {
    const self = this;
    self.isFocused = false;
    const cameraPosition = {
      x: self.camera.position.x,
      y: self.camera.position.y,
      z: self.camera.position.z,
    };
    new TWEEN.Tween(cameraPosition)
      .to(this.preFocus, 600)
      .easing(TWEEN.Easing.Linear.None)
      .on('update', function() {
        self.camera.position.set(this.object.x, this.object.y, this.object.z);
        self.camera.lookAt(new THREE.Vector3(0, 0, 0));
      })
      .on('complete', function() {
        self.camera.lookAt(new THREE.Vector3(0, 0, 0));
        self.controls.autoRotate = true;
        self.controls.enableRotate = true;
        self.controls.minPolarAngle = self.options.orbitControls.minPolarAngle;
        self.controls.maxPolarAngle = self.options.orbitControls.maxPolarAngle;
      })
      .start();
  }

  render = () => {
    TWEEN.update();

    // camera rotation > globe, markers, cloud rotation change
    this.globe.rotation.y += 0.001;
    this.cloud.rotation.y += 0.00125;
    this.markers.rotation.y += 0.001;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.frameId = window.requestAnimationFrame(this.render);
  };

  stop() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  _getIntersectedObject() {
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    // this.mouse.x =
    //   (event.pageX - rect.left - window.scrollX) / canvas.clientWidth * 2 - 1;
    // this.mouse.y =
    //   -(event.pageY - rect.top - window.scrollY) / canvas.clientHeight * 2 + 1;
    // this.raycaster.setFromCamera(this.mouse, this.camera);
    const all = [this.globe, ...this.markers.children];
    const objects = this.raycaster.intersectObjects(all);
    if (objects.length > 0) {
      // This is to filter out the globe.
      // If we don't have this check, user would be able to click through the
      // earth and hit the marker on the back side of the globe
      if (objects[0].object.uuid !== this.globe.uuid) {
        return objects[0].object;
      }
    }
    return null;
  }

  _createRenderer() {
    const renderer = new THREE.WebGLRenderer(this.options.renderer);
    renderer.domElement.addEventListener('click', this.onClick);
    renderer.domElement.addEventListener('mousemove', this.onMousemove);
    renderer.setSize(this.width, this.height);

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.autoClear = false;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
    return renderer;
  }

  _createScene() {
    return new THREE.Scene();
  }

  _createCamera() {
    const {
      far,
      near,
      positionX,
      positionY,
      radiusScale,
      viewAngle,
    } = this.options.camera;
    const camera = new THREE.PerspectiveCamera(
      viewAngle,
      this.aspect,
      near,
      far,
    );
    camera.position.set(positionX, positionY, this.radius * radiusScale);
    this.lastCameraPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    camera.lookAt(this.scene.position);
    return camera;
  }

  _createOrbitControls() {
    const {
      enablePan,
      enableZoom,
      enableRotate,
      zoomSpeed,
      rotateSpeed,
      enableDamping,
      dampingFactor,
      autoRotate,
      autoRotateSpeed,
      minPolarAngle,
      maxPolarAngle,
    } = this.options.orbitControls;
    const orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
    orbitControls.enablePan = enablePan;
    orbitControls.enableZoom = enableZoom;
    orbitControls.enableRotate = enableRotate;
    orbitControls.zoomSpeed = zoomSpeed;
    orbitControls.rotateSpeed = rotateSpeed;
    orbitControls.enableDamping = enableDamping;
    orbitControls.dampingFactor = dampingFactor;
    orbitControls.autoRotate = autoRotate;
    orbitControls.autoRotateSpeed = autoRotateSpeed;
    orbitControls.minPolarAngle = minPolarAngle;
    orbitControls.maxPolarAngle = maxPolarAngle;
    return orbitControls;
  }

  _createLight() {
    if (!this.camera) {
      throw new Error('Camera needs to be created before creating light.');
    }

    // scenelight
    const sceneLight = new THREE.AmbientLight(
      this.options.light.sceneLightColor,
      this.options.light.sceneLightIntensity,
    );
    // sceneLight.position.set( -0.8, 2, 0.8 ).normalize();
    // sceneLight.target.position.set(0, 0, 0);
    this.scene.add(sceneLight);

    // front light
    const frontLight = new THREE.SpotLight(
      this.options.light.frontLightColor,
      this.options.light.frontLightIntensity,
      // this.radius * 10,
    );
    frontLight.target.position.set(0, 0, 0);
    frontLight.position.set(this.radius * -0.4, this.radius * 1.55, this.radius * 2.0);
    // frontLight shadow
    frontLight.castShadow = true;
    frontLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, this.radius * 0.1, this.radius * 6.0 ) );
    frontLight.shadow.bias = 0.0001;
    frontLight.shadow.width = 4096;
    frontLight.shadow.height = 4096;
    this.scene.add(frontLight);

    // back light
    const backLight = new THREE.DirectionalLight(
      this.options.light.backLightColor,
      this.options.light.backLightIntensity,
      // this.radius * 10,
    );
    backLight.position.set( 1, -1, -1 ).normalize();
    backLight.target.position.set(0, 0, 0);
    this.scene.add(backLight);

  }

  _createSpace() {

    // add star
    var i, r = this.radius, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

    var vertices1 = [];
    var vertices2 = [];

    var vertex = new THREE.Vector3();

    for ( i = 0; i < 250; i ++ ) {

      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );

      vertices1.push( vertex.x, vertex.y, vertex.z );

    }

    for ( i = 0; i < 1500; i ++ ) {

      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );

      vertices2.push( vertex.x, vertex.y, vertex.z );

    }

    starsGeometry[ 0 ].addAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
    starsGeometry[ 1 ].addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

    var stars;
    var starsMaterials = [
      new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
    ];

    for ( i = 10; i < 30; i ++ ) {

      stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

      stars.rotation.x = Math.random() * 6;
      stars.rotation.y = Math.random() * 6;
      stars.rotation.z = Math.random() * 6;
      stars.scale.setScalar( i * 10 );

      stars.matrixAutoUpdate = false;
      stars.updateMatrix();

      this.scene.add( stars );

    }

  //return new THREE.Mesh(
      //new THREE.SphereGeometry(
        //Math.min(this.options.space.radius, this.radius * 6),
        //this.options.space.widthSegments,
        //this.options.space.heightSegments,
      //),
      //new THREE.MeshBasicMaterial({
        //map: loadTexture(this.textures.space),
        //side: THREE.BackSide,
      //}),
    //);
  }


  _createGlobe() {
    const sphereMaterial = new THREE.MeshPhongMaterial({
      specularColor: 0xffffff,
      shininess: 12,
      map: loadTexture(this.textures.globe),
      specularMap:loadTexture('/assets/react3dglobe/textures/earth_specular_2048.jpg'),
      // specularMap: loadTexture(this.textures.globeSpecular),
      normalMap: loadTexture('/assets/react3dglobe/textures/earth_normal_2048.jpg'),
      normalScale: new THREE.Vector2( 0.85, 0.85 ),
      bumpMap: loadTexture('/assets/react3dglobe/textures/earth_elevation_4096.png'),
      bumpScale: 1,
    });
    let geometry = null;
    switch (this.options.globe.type) {
      case 'low-poly':
        geometry = new THREE.DodecahedronGeometry(this.radius, 2);
        geometry.computeFlatVertexNormals();
        sphereMaterial.flatShading = true;
        break;
      case 'real':
        geometry = new THREE.SphereGeometry(
          this.radius,
          this.options.globe.widthSegments,
          this.options.globe.heightSegments,
        );
        break;
      default:
        throw new Error('Not supported globe type.');
    }
    const globe = new THREE.Mesh(geometry, sphereMaterial);
    globe.position.set(0, 0, 0);
    globe.castShadow = false;
    globe.receiveShadow = true;


    // earth glow shader
    const glowShaders = {
      'earthGlow' : {
        uniforms: {
          'texture': { type: 't', value: null }
        },
        vertexShader: [
          'varying vec3 vNormal;',
          'varying vec2 vUv;',
          'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
          '}'
        ].join('\n'),
        fragmentShader: [
          'uniform sampler2D texture;',
          'varying vec3 vNormal;',
          'varying vec2 vUv;',
          'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',		// top bright : 1.05
          'vec3 atmosphere = vec3( 0.255, 0.595, 1.275 ) * pow( intensity, 2.4 );',	// inner color white : vec3( 1.0, 1.0, 1.0 ) // gradient size : intensity, 3.0
          'gl_FragColor = vec4( diffuse + atmosphere, 0.65 );',		// bright : 1.0
          '}'
        ].join('\n')
      },
      'atmosphere' : {
        uniforms: {},
        vertexShader: [
          'varying vec3 vNormal;',
          'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          '}'
        ].join('\n'),
        fragmentShader: [
          'varying vec3 vNormal;',
          'void main() {',
          'float intensity = pow( 0.72 - dot( vNormal, vec3( 0, 0, 0.54 ) ), 8.0 );',	// 12.0
          'gl_FragColor = vec4( 0.255, 0.595, 1.275, 0.75 ) * intensity;',	// out color white : ( 1.0, 1.0, 1.0, 1.0 )
          '}'
        ].join('\n')
      }
    };

    // earth glow shader start
    const geometryEarthGlow = new THREE.SphereGeometry( this.radius*1.002, 160, 80 );

    // glow in
    const shaderIn = glowShaders['earthGlow']
    const uniformsIn = THREE.UniformsUtils.clone(shaderIn.uniforms);

    const materialEarthGlowIn = new THREE.ShaderMaterial({
      uniforms: uniformsIn,
      vertexShader: shaderIn.vertexShader,
      fragmentShader: shaderIn.fragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const meshEarthGlowIn = new THREE.Mesh(geometryEarthGlow, materialEarthGlowIn);
    meshEarthGlowIn.rotation.y = Math.PI;
    this.scene.add(meshEarthGlowIn);

    // glow out
    const shaderOut = glowShaders['atmosphere'];
    const uniformsOut = THREE.UniformsUtils.clone(shaderOut.uniforms);

    const materialEarthGlowOut = new THREE.ShaderMaterial({
      uniforms: uniformsOut,
      vertexShader: shaderOut.vertexShader,
      fragmentShader: shaderOut.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const meshEarthGlowOut = new THREE.Mesh(geometryEarthGlow, materialEarthGlowOut);
    meshEarthGlowOut.scale.set( 1.2, 1.2, 1.2 );
    this.scene.add(meshEarthGlowOut);
    // earth glow shader end

    return globe;
  }

  _createCloud() {
    const sphereMaterial = new THREE.MeshLambertMaterial({
      map: loadTexture(this.textures.cloud),
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const geometry = new THREE.SphereGeometry(
      this.radius * 1.004,
      this.options.globe.widthSegments,
      this.options.globe.heightSegments,
    );
    const cloud = new THREE.Mesh(geometry, sphereMaterial);
    cloud.position.set(0, 0, 0);
    cloud.castShadow = false;
    cloud.receiveShadow = true;
    return cloud;
  }


  _createMarkers() {
    //lat, lon, altitude, scene, _opts, canvas, texture
    //var stl = new Satllite(32,37, 0, this.scene, this.options, null, null)
    return new THREE.Group();
  }


  _createLogos(_scene) {
    // extruded shape mex all start

    function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

      // extruded shape

      const geometryLogo = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

      const meshLogo = new THREE.Mesh( geometryLogo, new THREE.MeshPhongMaterial( { color: color, shininess: 80, specular: 0xffffff } ) );
      meshLogo.position.set( -500, 400, 885 );
      meshLogo.rotation.set( rx - 0.15, ry, rz );
      meshLogo.scale.set( s, s, s );
      meshLogo.castShadow = true;
      meshLogo.receiveShadow = true;
      _scene.add(meshLogo);
      // return meshLogo;
    }

    // mark logo <
    const logo01_shape = new THREE.Shape();
    logo01_shape.moveTo(63.0, 13.2);
    logo01_shape.lineTo(63.0, 0.0);
    logo01_shape.lineTo(49.5, 0.0);
    logo01_shape.lineTo(0.0, 49.6);
    logo01_shape.lineTo(0.0, 62.9);
    logo01_shape.lineTo(49.6, 112.4);
    logo01_shape.lineTo(63.0, 112.4);
    logo01_shape.lineTo(63.0, 99.2);
    logo01_shape.lineTo(20.0, 56.2);
    logo01_shape.lineTo(63.0, 13.2);
    logo01_shape.closePath();

    // mark logo M
    const logo02_shape = new THREE.Shape();
    logo02_shape.moveTo(75.8, 0.0);
    logo02_shape.lineTo(100.5, 0.0);
    logo02_shape.lineTo(134.8, 62.2);
    logo02_shape.lineTo(168.7, 0.0);
    logo02_shape.lineTo(193.4, 0.0);
    logo02_shape.lineTo(193.4, 112.4);
    logo02_shape.lineTo(173.6, 112.4);
    logo02_shape.lineTo(173.6, 32.0);
    logo02_shape.lineTo(138.5, 96.8);
    logo02_shape.lineTo(130.5, 96.8);
    logo02_shape.lineTo(95.5, 32.0);
    logo02_shape.lineTo(95.5, 112.4);
    logo02_shape.lineTo(75.8, 112.4);
    logo02_shape.lineTo(75.8, 0.0);
    logo02_shape.closePath();

    // mark logo o
    const logo03_shape = new THREE.Shape();
    logo03_shape.moveTo(286.5, 72.3);
    logo03_shape.bezierCurveTo(286.5, 96.6, 269.1, 114.1, 245.4, 114.1);
    logo03_shape.bezierCurveTo(221.8, 114.1, 204.4, 96.4, 204.4, 72.3);
    logo03_shape.bezierCurveTo(204.4, 48.2, 221.8, 30.6, 245.4, 30.6);
    logo03_shape.bezierCurveTo(269.1, 30.7, 286.5, 48.3, 286.5, 72.3);
    logo03_shape.closePath();
    const logo03_path = new THREE.Path();
    logo03_path.moveTo(267.5, 72.3);
    logo03_path.bezierCurveTo(267.5, 56.0, 257.1, 47.6, 245.4, 47.6);
    logo03_path.bezierCurveTo(233.8, 47.6, 223.3, 56.0, 223.3, 72.3);
    logo03_path.bezierCurveTo(223.3, 88.6, 233.8, 97.3, 245.4, 97.3);
    logo03_path.bezierCurveTo(257.1, 97.4, 267.5, 88.9, 267.5, 72.3);
    logo03_path.lineTo(267.5, 72.3);
    logo03_path.closePath();
    logo03_shape.holes.push( logo03_path );

    // mark logo b
    const logo04_shape = new THREE.Shape();
    logo04_shape.moveTo(297.7, 112.3);
    logo04_shape.lineTo(297.7, 0.0);
    logo04_shape.lineTo(316.3, 0.0);
    logo04_shape.lineTo(316.2, 43.0);
    logo04_shape.bezierCurveTo(319.8, 36.8, 328.9, 31.2, 341.1, 31.2);
    logo04_shape.bezierCurveTo(364.8, 31.2, 377.7, 49.2, 377.7, 72.5);
    logo04_shape.bezierCurveTo(377.7, 96.4, 363.5, 114.6, 340.5, 114.6);
    logo04_shape.bezierCurveTo(329.3, 114.6, 320.7, 109.6, 316.2, 101.9);
    logo04_shape.lineTo(305.6, 112.5);
    logo04_shape.lineTo(297.7, 112.3);
    logo04_shape.closePath();
    const logo04_path = new THREE.Path();
    logo04_path.moveTo(337.3, 47.8);
    logo04_path.bezierCurveTo(325.3, 47.8, 316.0, 56.8, 316.0, 72.5);
    logo04_path.bezierCurveTo(316.0, 88.1, 325.3, 97.5, 337.3, 97.5);
    logo04_path.bezierCurveTo(349.6, 97.5, 358.6, 88.1, 358.6, 72.5);
    logo04_path.bezierCurveTo(358.6, 56.8, 349.8, 47.8, 337.3, 47.8);
    logo04_path.lineTo(337.3, 47.8);
    logo04_path.closePath();
    logo04_shape.holes.push( logo04_path );

    // mark logo i
    const logo05_shape = new THREE.Shape();
    logo05_shape.moveTo(390.7, 33.0);
    logo05_shape.lineTo(409.4, 33.0);
    logo05_shape.lineTo(409.4, 112.4);
    logo05_shape.lineTo(390.7, 112.4);
    logo05_shape.lineTo(390.7, 33.0);
    logo05_shape.closePath();
    const logo06_shape = new THREE.Shape();
    logo06_shape.moveTo(390.8, 0.0);
    logo06_shape.lineTo(409.3, 0.0);
    logo06_shape.lineTo(409.3, 18.5);
    logo06_shape.lineTo(390.8, 18.5);
    logo06_shape.lineTo(390.8, 0.0);
    logo06_shape.closePath();

    // mark logo l
    const logo07_shape = new THREE.Shape();
    logo07_shape.moveTo(424.3, 112.4);
    logo07_shape.lineTo(424.3, 0.0);
    logo07_shape.lineTo(443.2, 0.0);
    logo07_shape.lineTo(443.2, 112.3);
    logo07_shape.lineTo(424.3, 112.4);
    logo07_shape.lineTo(424.3, 112.4);
    logo07_shape.closePath();

    // mark logo e
    const logo08_shape = new THREE.Shape();
    logo08_shape.moveTo(508.5, 95.7);
    logo08_shape.bezierCurveTo(505.0, 97.2, 501.0, 98.0, 497.0, 98.0);
    logo08_shape.bezierCurveTo(491.7, 98.2, 486.6, 96.3, 482.5, 93.0);
    logo08_shape.bezierCurveTo(478.6, 89.7, 476.0, 85.1, 474.7, 79.3);
    logo08_shape.lineTo(532.3, 79.3);
    logo08_shape.bezierCurveTo(532.6, 77.3, 532.7, 75.3, 532.8, 73.3);
    logo08_shape.bezierCurveTo(532.8, 59.8, 529.7, 50.0, 523.4, 42.6);
    logo08_shape.bezierCurveTo(517.1, 35.2, 507.4, 30.8, 495.0, 30.8);
    logo08_shape.bezierCurveTo(487.8, 30.7, 480.7, 32.5, 474.5, 36.1);
    logo08_shape.bezierCurveTo(468.5, 39.6, 463.6, 44.7, 460.4, 50.9);
    logo08_shape.bezierCurveTo(456.9, 57.6, 455.3, 65.1, 455.4, 72.6);
    logo08_shape.bezierCurveTo(455.2, 80.1, 457.0, 87.6, 460.4, 94.3);
    logo08_shape.bezierCurveTo(463.5, 100.5, 468.5, 105.5, 474.5, 108.9);
    logo08_shape.bezierCurveTo(480.6, 112.4, 487.5, 114.1, 495.5, 114.1);
    logo08_shape.bezierCurveTo(501.8, 114.2, 508.2, 113.0, 514.1, 110.4);
    logo08_shape.bezierCurveTo(519.7, 108.0, 524.6, 104.4, 528.6, 99.9);
    logo08_shape.lineTo(517.7, 89.1);
    logo08_shape.bezierCurveTo(515.1, 91.9, 512.0, 94.2, 508.5, 95.7);
    logo08_shape.closePath();
    const logo08_path = new THREE.Path();
    logo08_path.moveTo(481.2, 51.6);
    logo08_path.bezierCurveTo(484.9, 48.0, 490.0, 46.2, 495.1, 46.3);
    logo08_path.bezierCurveTo(501.0, 46.3, 505.4, 48.2, 509.0, 51.8);
    logo08_path.bezierCurveTo(512.7, 55.4, 514.2, 60.1, 514.4, 66.1);
    logo08_path.lineTo(474.6, 66.1);
    logo08_path.bezierCurveTo(474.9, 60.6, 477.2, 55.4, 481.2, 51.6);
    logo08_path.closePath();
    logo08_shape.holes.push( logo08_path );

    // mark logo d
    const logo09_shape = new THREE.Shape();
    logo09_shape.moveTo(604.4, 0.0);
    logo09_shape.lineTo(604.4, 42.4);
    logo09_shape.bezierCurveTo(602.0, 37.4, 595.0, 31.0, 581.2, 31.0);
    logo09_shape.bezierCurveTo(558.9, 31.0, 543.5, 49.7, 543.5, 72.5);
    logo09_shape.bezierCurveTo(543.5, 96.4, 558.6, 114.4, 581.4, 114.4);
    logo09_shape.bezierCurveTo(592.6, 114.4, 601.1, 108.7, 604.8, 102.1);
    logo09_shape.lineTo(604.8, 102.1);
    logo09_shape.lineTo(615.1, 112.4);
    logo09_shape.lineTo(622.9, 112.4);
    logo09_shape.lineTo(622.9, 97.9);
    logo09_shape.lineTo(622.9, 97.9);
    logo09_shape.lineTo(622.9, 0.0);
    logo09_shape.lineTo(604.4, 0.0);
    logo09_shape.closePath();
    const logo09_path = new THREE.Path();
    logo09_path.moveTo(583.7, 97.7);
    logo09_path.bezierCurveTo(570.8, 97.7, 562.4, 87.6, 562.4, 72.5);
    logo09_path.bezierCurveTo(562.4, 57.4, 571.5, 47.8, 583.9, 47.8);
    logo09_path.bezierCurveTo(596.3, 47.8, 604.7, 57.2, 604.7, 72.3);
    logo09_path.bezierCurveTo(604.7, 87.4, 596.0, 97.7, 583.7, 97.7);
    logo09_path.closePath();
    logo09_shape.holes.push( logo09_path );

    // mark logo g
    const logo10_shape = new THREE.Shape();
    logo10_shape.moveTo(703.1, 33.0);
    logo10_shape.lineTo(693.9, 42.2);
    logo10_shape.bezierCurveTo(691.5, 37.2, 684.4, 30.9, 670.7, 30.9);
    logo10_shape.bezierCurveTo(664.3, 30.9, 658.0, 32.6, 652.4, 35.8);
    logo10_shape.bezierCurveTo(640.7, 42.1, 633.4, 54.8, 633.1, 69.3);
    logo10_shape.bezierCurveTo(633.0, 70.3, 633.0, 71.4, 633.0, 72.3);
    logo10_shape.bezierCurveTo(633.0, 96.2, 648.3, 114.2, 671.0, 114.2);
    logo10_shape.bezierCurveTo(680.7, 114.2, 688.3, 109.9, 692.6, 104.4);
    logo10_shape.lineTo(692.6, 105.3);
    logo10_shape.bezierCurveTo(692.6, 121.3, 685.2, 129.0, 670.4, 129.0);
    logo10_shape.lineTo(670.1, 129.0);
    logo10_shape.bezierCurveTo(658.8, 129.0, 651.7, 124.3, 648.1, 121.3);
    logo10_shape.bezierCurveTo(646.7, 120.2, 646.3, 119.6, 645.9, 119.3);
    logo10_shape.lineTo(634.3, 131.0);
    logo10_shape.bezierCurveTo(635.1, 131.9, 635.5, 132.3, 636.4, 133.1);
    logo10_shape.bezierCurveTo(643.9, 140.0, 654.7, 145.3, 670.5, 145.3);
    logo10_shape.lineTo(670.7, 145.3);
    logo10_shape.bezierCurveTo(700.4, 145.3, 711.3, 125.6, 711.3, 104.5);
    logo10_shape.lineTo(711.3, 33.0);
    logo10_shape.lineTo(703.1, 33.0);
    logo10_shape.closePath();
    var logo10_path = new THREE.Path();
    logo10_path.moveTo(673.1, 97.5);
    logo10_path.bezierCurveTo(660.2, 97.5, 651.8, 87.4, 651.8, 72.3);
    logo10_path.bezierCurveTo(651.8, 59.2, 658.8, 50.1, 668.7, 48.0);
    logo10_path.bezierCurveTo(670.0, 47.8, 671.4, 47.7, 672.7, 47.7);
    logo10_path.bezierCurveTo(677.0, 47.7, 681.1, 48.9, 684.8, 51.2);
    logo10_path.bezierCurveTo(690.2, 55.3, 693.3, 62.6, 693.3, 72.2);
    logo10_path.bezierCurveTo(693.3, 87.3, 685.5, 97.5, 673.1, 97.5);
    logo10_path.closePath();
    logo10_shape.holes.push( logo10_path );

    // mark logo e
    const logo11_shape = new THREE.Shape();
    logo11_shape.moveTo(774.5, 95.7);
    logo11_shape.bezierCurveTo(771.0, 97.2, 767.0, 98.0, 763.0, 98.0);
    logo11_shape.bezierCurveTo(757.7, 98.2, 752.6, 96.3, 748.5, 93.0);
    logo11_shape.bezierCurveTo(744.6, 89.7, 742.0, 85.1, 740.7, 79.3);
    logo11_shape.lineTo(798.3, 79.3);
    logo11_shape.bezierCurveTo(798.6, 77.3, 798.7, 75.3, 798.8, 73.3);
    logo11_shape.bezierCurveTo(798.8, 59.8, 795.7, 50.0, 789.4, 42.6);
    logo11_shape.bezierCurveTo(783.1, 35.2, 773.4, 30.8, 761.0, 30.8);
    logo11_shape.bezierCurveTo(753.8, 30.7, 746.7, 32.5, 740.5, 36.1);
    logo11_shape.bezierCurveTo(734.5, 39.6, 729.6, 44.7, 726.4, 50.9);
    logo11_shape.bezierCurveTo(722.9, 57.6, 721.3, 65.1, 721.4, 72.6);
    logo11_shape.bezierCurveTo(721.2, 80.1, 723.0, 87.6, 726.4, 94.3);
    logo11_shape.bezierCurveTo(729.5, 100.5, 734.5, 105.5, 740.5, 108.9);
    logo11_shape.bezierCurveTo(746.6, 112.4, 753.5, 114.1, 761.5, 114.1);
    logo11_shape.bezierCurveTo(767.8, 114.2, 774.2, 113.0, 780.0, 110.4);
    logo11_shape.bezierCurveTo(785.6, 108.0, 790.5, 104.4, 794.5, 99.9);
    logo11_shape.lineTo(783.7, 89.0);
    logo11_shape.bezierCurveTo(781.2, 91.9, 778.1, 94.2, 774.5, 95.7);
    logo11_shape.closePath();
    const logo11_path = new THREE.Path();
    logo11_path.moveTo(747.3, 51.6);
    logo11_path.bezierCurveTo(751.0, 48.0, 756.1, 46.2, 761.2, 46.3);
    logo11_path.bezierCurveTo(767.1, 46.3, 771.5, 48.2, 775.1, 51.8);
    logo11_path.bezierCurveTo(778.8, 55.4, 780.3, 60.1, 780.5, 66.1);
    logo11_path.lineTo(740.7, 66.1);
    logo11_path.bezierCurveTo(741.0, 60.6, 743.3, 55.4, 747.3, 51.6);
    logo11_path.closePath();
    logo11_shape.holes.push( logo11_path );

    // mark logo X
    const logo12_shape = new THREE.Shape();
    logo12_shape.moveTo(890.3, 65.3);
    logo12_shape.lineTo(877.0, 78.6);
    logo12_shape.lineTo(910.9, 112.5);
    logo12_shape.lineTo(924.2, 112.5);
    logo12_shape.lineTo(924.2, 112.5);
    logo12_shape.lineTo(924.2, 112.4);
    logo12_shape.lineTo(924.2, 99.1);
    logo12_shape.lineTo(890.3, 65.3);
    logo12_shape.closePath();
    const logo13_shape = new THREE.Shape();
    logo13_shape.moveTo(825.0, 0.0);
    logo13_shape.lineTo(811.6, 0.0);
    logo13_shape.lineTo(811.6, 13.2);
    logo13_shape.lineTo(845.4, 47.1);
    logo13_shape.lineTo(858.8, 33.8);
    logo13_shape.lineTo(825.0, 0.0);
    logo13_shape.closePath();
    const logo14_shape = new THREE.Shape();
    logo14_shape.moveTo(924.2, 13.2);
    logo14_shape.lineTo(924.2, 0.0);
    logo14_shape.lineTo(910.7, 0.0);
    logo14_shape.lineTo(811.6, 99.2);
    logo14_shape.lineTo(811.6, 112.4);
    logo14_shape.lineTo(825.0, 112.4);
    logo14_shape.lineTo(924.2, 13.2);
    logo14_shape.closePath();

    // mark logo >
    const logo15_shape = new THREE.Shape();
    logo15_shape.moveTo(937.0, 13.2);
    logo15_shape.lineTo(937.0, 0.0);
    logo15_shape.lineTo(950.5, 0.0);
    logo15_shape.lineTo(1000.0, 49.6);
    logo15_shape.lineTo(1000.0, 62.9);
    logo15_shape.lineTo(950.5, 112.4);
    logo15_shape.lineTo(937.0, 112.4);
    logo15_shape.lineTo(937.0, 99.2);
    logo15_shape.lineTo(980.0, 56.2);
    logo15_shape.lineTo(937.0, 13.2);
    logo15_shape.closePath();

    const extrudeSettings = { depth: 36, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 3, bevelThickness: 3, curveSegments: 20 };

    // addShape( shape, color, x, y, z, rx, ry,rz, size );

    addShape( logo01_shape,	extrudeSettings, 0x44DD00, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo02_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo03_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo04_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo05_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo06_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo07_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo08_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo09_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo10_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo11_shape,	extrudeSettings, 0xCCCCCC, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo12_shape,	extrudeSettings, 0x44DD00, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo13_shape,	extrudeSettings, 0x44DD00, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo14_shape,	extrudeSettings, 0x44DD00, 0, 0, 0, Math.PI, 0, 0, 1 );
    addShape( logo15_shape,	extrudeSettings, 0x44DD00, 0, 0, 0, Math.PI, 0, 0, 1 );

    // extruded shape mex all end

    _scene.add(this.logos);
    return new THREE.Group();
  }

  _createRaycaster() {
    return new THREE.Raycaster();
  }

  _createMouse() {
    return new THREE.Vector2();
  }
}

export default Globe;
