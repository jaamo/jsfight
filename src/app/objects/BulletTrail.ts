import {
  Mesh,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  BufferAttribute,
} from "three";
import { IBulletTrail } from "../interfaces/interfaces";

export class BulletTrailObject extends Mesh {
  private maxLifetime: number = 10;
  private lifetime: number = 0;
  private trailMaterial: LineBasicMaterial = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
  });

  constructor(bulletTrail: IBulletTrail) {
    super();

    this.lifetime = this.maxLifetime;

    // Define geometry
    const bulletTrailGeometry: BufferGeometry = new BufferGeometry();
    const bulletTrailVertices = new Float32Array([
      bulletTrail.startX,
      2,
      bulletTrail.startY,
      bulletTrail.endX,
      2,
      bulletTrail.endY,
    ]);
    bulletTrailGeometry.setAttribute(
      "position",
      new BufferAttribute(bulletTrailVertices, 3)
    );

    // Add line
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
