function createGround() {
  var width = 500;
  var height = 450;
  // Materials
  var texture = new THREE.TextureLoader().load(
    "https://rawgit.com/mmmovania/Physijs_Tutorials/master/textures/floor.jpg"
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  var mat = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: texture,
      color: 0xaaaaaa
    }),
    0.6,
    0
  );
  // Ground
  var geo = new THREE.BoxGeometry(width, 5, height);
  ground = new Physijs.BoxMesh(geo, mat, 0 /* mass */);
  var borderLeft = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 20, height),
    mat,
    0
  );
  borderLeft.position.x = -width / 2;
  borderLeft.receiveShadow = true;
  ground.add(borderLeft);
  var borderRight = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 20, height),
    mat,
    0
  );
  borderRight.position.x = width / 2;
  borderRight.receiveShadow = true;
  ground.add(borderRight);
  var borderBottom = new Physijs.BoxMesh(
    new THREE.BoxGeometry(width, 20, 5),
    mat,
    0
  );
  borderBottom.position.z = height / 2;
  borderBottom.receiveShadow = true;
  ground.add(borderBottom);
  var borderTop = new Physijs.BoxMesh(
    new THREE.BoxGeometry(width, 20, 5),
    mat,
    0
  );
  borderTop.position.z = -height / 2;
  borderTop.receiveShadow = true;
  ground.add(borderTop);
  ground.receiveShadow = true;
  scene.add(ground);
}
