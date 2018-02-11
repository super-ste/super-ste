class Car {
  constructor() {
    let wheel_mass = 100;
    let wheel_front_friction = 1.5;
    let wheel_front_restitution = .3;
    let wheel_rear_friction = 1.5;
    let wheel_rear_restitution = .3;
    let body_mass = 2000;
    let body = {};
    let fl = {}, fr = {}, rl = {}, rr  ={};
  }

  buildWheel ( position, friction, restitution, mass ) {
      let mat = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0x222222
      }), this.friction, this.restitution);
      let geo = new THREE.CylinderGeometry(3, 3, 2, 32);
      let wheel = new Physijs.CylinderMesh(geo, mat, this.mass);
      wheel.rotation.x = Math.PI / 2;
      wheel.castShadow = true;
      wheel.position.copy(position);
      return wheel;
      }
  buildBody (mass) {
    var geo = new THREE.BoxGeometry(15, 4, 4);
    var mat = new THREE.MeshLambertMaterial({
     color: 0xFF0000
    });
     let body = new Physijs.BoxMesh(geo, mat, this.mass);
    body.position.set(5, 5, 5);
    body.castShadow = true;
    return body;
  }

  doSpawn() {
        // create the car body
        this.body = this.buildBody(this.body_mass);
        scene.add( this.body );
        // create the wheels
        this.fr = this.buildWheel(new THREE.Vector3(10, 4, 10), this.wheel_front_friction, this.wheel_front_restitutionn, this.wheel_mass);
        this.fl = this.buildWheel(new THREE.Vector3(0,  4, 10), this.wheel_front_friction, this.wheel_front_restitutionn, this.wheel_mass);
        this.rr = this.buildWheel(new THREE.Vector3(10, 4,  0), this.wheel_rear_friction, this.wheel_rear_restitution, this.wheel_mass);
        this.rl = this.buildWheel(new THREE.Vector3(0,  4,  0), this.wheel_rear_friction, this.wheel_rear_restitution, this.wheel_mass);
        scene.add( this.fr );
        scene.add( this.fl );
        scene.add( this.rr );
        scene.add( this.rl );
        // Creating the DoFs
        this.frConstraint = new Physijs.DOFConstraint(this.fr, this.body, new THREE.Vector3(10, 4, 8));
        this.flConstraint = new Physijs.DOFConstraint(this.fl, this.body, new THREE.Vector3(10, 4, 2));
        this.rrConstraint = new Physijs.DOFConstraint(this.rr, this.body, new THREE.Vector3(0, 4, 8));
        this.rlConstraint = new Physijs.DOFConstraint(this.rl, this.body, new THREE.Vector3(0, 4, 2));
        scene.addConstraint(this.frConstraint);
        scene.addConstraint(this.flConstraint);
        scene.addConstraint(this.rlConstraint);
        scene.addConstraint(this.rrConstraint);
        // front wheels should only move along the z axis.
        // we don't need to specify anything here, since
        // that value is overridden by the motors
        this.rrConstraint.setAngularLowerLimit({
          x: 0,
          y: 0,
          z: 0
        });
        this.rrConstraint.setAngularUpperLimit({
          x: 0,
          y: 0,
          z: 0
        });
        this.rlConstraint.setAngularLowerLimit({
          x: 0,
          y: 0,
          z: 0
        });
        this.rlConstraint.setAngularUpperLimit({
          x: 0,
          y: 0,
          z: 0
        });
        // motor two is forward and backwards
        this.rlConstraint.enableAngularMotor(2);
        this.rrConstraint.enableAngularMotor(2);
/*        body.userData.rlConstraint = rlConstraint;
        body.userData.rrConstraint = rrConstraint;
        body.userData.flConstraint = flConstraint;
        body.userData.frConstraint = frConstraint;
*/
      };
}






class Bubble {
  constructor(x, y, r = 50) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.brightness = 0;
  }

  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return (d < this.r + other.r);
    // if (d < this.r + other.r) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  changeColor(bright) {
    this.brightness = bright;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }

  move() {
    this.x = this.x + random(-2, 2);
    this.y = this.y + random(-2, 2);
  }

  show() {
    stroke(255);
    strokeWeight(4);
    fill(this.brightness, 125);
    ellipse(this.x, this.y, this.r * 2);
  }
}
