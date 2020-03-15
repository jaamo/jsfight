import { Mesh, LineBasicMaterial, Geometry, Line, Vector3 } from "three";
import { IBulletTrail } from "../interfaces/gameState";

export class BulletTrailObject extends Mesh {
  private maxLifetime: number = 10;
  private lifetime: number = 0;
  private trailMaterial: LineBasicMaterial = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true
  });

  constructor(bulletTrail: IBulletTrail) {
    super();

    this.lifetime = this.maxLifetime;

    const bulletTrailGeometry: Geometry = new Geometry();
    bulletTrailGeometry.vertices.push(
      new Vector3(bulletTrail.startX, 2, bulletTrail.startY),
      new Vector3(bulletTrail.endX, 2, bulletTrail.endY)
    );
    const trail = new Line(bulletTrailGeometry, this.trailMaterial);
    this.add(trail);
  }

  public tick(): void {
    this.lifetime--;
    this.trailMaterial.opacity =
      1 - (this.maxLifetime - this.lifetime) / this.maxLifetime;
  }

  public isDead(): boolean {
    return this.lifetime <= 0;
  }
}
