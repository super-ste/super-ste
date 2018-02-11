'use strict';
Physijs.scripts.worker = "/lib/physijs_worker.js";
Physijs.scripts.ammo = "/lib/ammo.js";
let initScene, render, renderer, scene, ground, camera;
let car = {};
let ambient, light, spotlight;
let stats;
let width = 640;
let height = 480;
let gravity = -290;

initScene = function() {
  renderer = new THREE.WebGLRenderer({
    antialias: false
  });
  renderer.setSize(width, height);
  renderer.setClearColor(new THREE.Color(0x999999));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("viewport").appendChild(renderer.domElement);
  scene = new Physijs.Scene({
    reportSize: 10,
    fixedTimeStep: 1 / 60
  });
  scene.setGravity(new THREE.Vector3(0, gravity, 0));
  // AmbientLight
  ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);
  // SpotLight
  spotlight = new THREE.SpotLight(0xffffff, 0.8);
  spotlight.position.set(10, 100, 0);
  spotlight.angle = 2;
  spotlight.castShadow = true;
  scene.add(spotlight);
  // Light
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(20, 40, -15);
  light.target.position.copy(scene.position);
  light.castShadow = true;
  light.shadowCameraLeft = -60;
  light.shadowCameraTop = -60;
  light.shadowCameraRight = 60;
  light.shadowCameraBottom = 60;
  light.shadowCameraNear = 20;
  light.shadowCameraFar = 200;
  light.shadowBias = -0.0001;
  light.shadowMapWidth = light.shadowMapHeight = 2048;
  light.shadowDarkness = 0.7;
  scene.add(light);
  // Ground
  createGround();
  // Car
  car = new Car();
  car.doSpawn();
  // CAmera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  scene.add(camera);

  var controls = new function() {
    this.velocity = 0;
    this.wheelAngle = 0;
    this.changeVelocity = function() {
      // if you add a motor, the current constraint is overridden
      // if you want to rotate set min higher then max
      /*
          car.userData.rlConstraint.configureAngularMotor(2, 0, -1, controls.velocity, 20000);
          car.userData.rrConstraint.configureAngularMotor(2, 0, -1, controls.velocity, 20000);
          */
      car.rlConstraint.configureAngularMotor(
        2,
        0,
        -1,
        controls.velocity,
        20000
      );
      car.rrConstraint.configureAngularMotor(
        2,
        0,
        -1,
        controls.velocity,
        20000
      );
    };
    this.changeOrientation = function() {
      // backwheels don't move themselves and are restriced in their
      // movement. They should be able to rotate along the z-axis
      // same here, if the complete angle is allowed set lower higher
      // than upper.
      // by setting the lower and upper to the same value you can
      // fix the position
      // we can set the x position to 'loosen' the axis for the directional
      /*
         car.userData.frConstraint.setAngularLowerLimit({
            x: 0,
            y: controls.wheelAngle,
            z: 2
          });
          car.userData.frConstraint.setAngularUpperLimit({
            x: 0,
            y: controls.wheelAngle,
            z: 0
          });
          car.userData.flConstraint.setAngularLowerLimit({
            x: 0,
            y: controls.wheelAngle,
            z: 2
          });
          car.userData.flConstraint.setAngularUpperLimit({
            x: 0,
            y: controls.wheelAngle,
            z: 0
          });
          */
      car.frConstraint.setAngularLowerLimit({
        x: 0,
        y: controls.wheelAngle,
        z: 2
      });
      car.frConstraint.setAngularUpperLimit({
        x: 0,
        y: controls.wheelAngle,
        z: 0
      });
      car.flConstraint.setAngularLowerLimit({
        x: 0,
        y: controls.wheelAngle,
        z: 2
      });
      car.flConstraint.setAngularUpperLimit({
        x: 0,
        y: controls.wheelAngle,
        z: 0
      });
    };
  }();
  var pressed = {};
  document.addEventListener("keydown", function(e) {
    var key = e.keyCode;
    pressed[key] = true;
    if (key === 38) {
      // up
      controls.velocity = -60;
      controls.changeVelocity();
    } else if (key === 40) {
      // down
      controls.velocity = 20;
      controls.changeVelocity();
    } else if (key === 37) {
      // left
      controls.wheelAngle = +0.3;
      controls.changeOrientation();
    } else if (key === 39) {
      // right
      controls.wheelAngle = -0.3;
      controls.changeOrientation();
    }
    if (key === 32) {
      // space
      // https://github.com/chandlerprall/Physijs/wiki/Updating-an-object's-position-&-rotation
      car.setLinearVelocity(new THREE.Vector3(0, 0, 0));
      car.setAngularVelocity(new THREE.Vector3(0, 0, 0));
      car.position.y = 20;
      car.__dirtyPosition = true;
      car.rotation.x += Math.PI;
      car.rotation.y += Math.PI;
      car.rotation.z += 0;
      car.__dirtyRotation = true;
    }
  });
  document.addEventListener("keyup", function(e) {
    var key = e.keyCode;
    pressed[key] = false;
    if (!pressed[38] && !pressed[40]) {
      controls.velocity = 0;
      controls.changeVelocity();
    }
    if (!pressed[37] && !pressed[39]) {
      controls.wheelAngle = 0;
      controls.changeOrientation();
    }
  });
  controls.changeVelocity();
  controls.changeOrientation();
  render();
  scene.simulate();
};

render = function() {
  if (car) {
    camera.position.copy(car.body.position).add(new THREE.Vector3(50, 35, 50));
    camera.lookAt(car.body.position);
  }
  renderer.render(scene, camera);
  scene.simulate(undefined, 2);
  requestAnimationFrame(render);
};

window.onload = initScene;
