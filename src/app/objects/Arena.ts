import {
  Mesh,
  DoubleSide,
  PlaneGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial
} from "three";

export class Arena extends Mesh {
  constructor() {
    super();

    this.geometry = new PlaneGeometry(1000, 1000, 100, 100);
    this.material = new MeshLambertMaterial({
      color: 0x1c4b82,
      side: DoubleSide
    });
    this.rotateX(Math.PI / 2);
    this.translateX(500);
    this.translateY(500);
  }
}
