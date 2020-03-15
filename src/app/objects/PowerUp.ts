import { Mesh, CylinderGeometry, MeshPhongMaterial } from "three";
import { IPowerUp } from "../interfaces/public";

export class PowerUp extends Mesh {
  public powerUpId: number = 0;
  constructor(powerUp: IPowerUp) {
    super();

    this.position.x = powerUp.x;
    this.position.z = powerUp.y;
    this.powerUpId = powerUp.id;

    this.geometry = new CylinderGeometry(10, 10, 8, 32);
    this.translateY(4);
    this.material = new MeshPhongMaterial({
      color: 0xff0000
    });
  }
}
