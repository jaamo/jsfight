import {
  Mesh,
  MeshBasicMaterial,
  CylinderGeometry,
  MeshPhongMaterial
} from "three";

export class Robot extends Mesh {
  constructor() {
    super();

    this.geometry = new CylinderGeometry(25, 25, 20, 32);
    this.translateY(10);
    // this.translateX(500);
    // this.translateZ(500);
    this.material = new MeshPhongMaterial({
      color: 0xdd6b4d
    });

    const gunGeometry: CylinderGeometry = new CylinderGeometry(5, 5, 10, 32);
    var gunMaterial: MeshPhongMaterial = new MeshPhongMaterial({
      color: 0xdd6b4d,
      shininess: 100
    });
    var gun = new Mesh(gunGeometry, gunMaterial);
    gun.rotateZ(Math.PI / 2);
    gun.translateY(-30);
    this.add(gun);
  }
}
